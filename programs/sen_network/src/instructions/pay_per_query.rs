use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::{errors::*, events::*, state::*};

#[derive(Accounts)]
pub struct PayPerQuery<'info> {
    #[account(
        seeds = [SENSOR_SEED, sensor.owner.as_ref(), sensor.sensor_id.as_bytes()],
        bump = sensor.bump,
        constraint = sensor.status == 1 @ SenError::SensorNotActive
    )]
    pub sensor: Account<'info, Sensor>,

    #[account(
        mut,
        seeds = [TREASURY_SEED, sensor.key().as_ref()],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, Treasury>,

    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = treasury
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [VAULT_SEED, usdc_mint.key().as_ref()],
        bump = vault.bump
    )]
    pub vault: Account<'info, ProgramVault>,

    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = vault
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,

    pub usdc_mint: Account<'info, anchor_spl::token::Mint>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<PayPerQuery>,
    amount: u64,
) -> Result<()> {
    require!(amount > 0, SenError::InvalidAmount);

    let treasury = &mut ctx.accounts.treasury;
    let vault = &mut ctx.accounts.vault;
    let clock = Clock::get()?;

    // Calculate fee split: 95% to treasury, 5% to vault
    let fee_amount = amount
        .checked_mul(5)
        .ok_or(SenError::ArithmeticOverflow)?
        .checked_div(100)
        .ok_or(SenError::ArithmeticOverflow)?;

    let treasury_amount = amount
        .checked_sub(fee_amount)
        .ok_or(SenError::ArithmeticOverflow)?;

    // Transfer to treasury (95%)
    let transfer_to_treasury = Transfer {
        from: ctx.accounts.buyer_token_account.to_account_info(),
        to: ctx.accounts.treasury_token_account.to_account_info(),
        authority: ctx.accounts.buyer.to_account_info(),
    };
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_to_treasury,
        ),
        treasury_amount,
    )?;

    // Transfer to vault (5% fee)
    let transfer_to_vault = Transfer {
        from: ctx.accounts.buyer_token_account.to_account_info(),
        to: ctx.accounts.vault_token_account.to_account_info(),
        authority: ctx.accounts.buyer.to_account_info(),
    };
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_to_vault,
        ),
        fee_amount,
    )?;

    // Update treasury stats
    treasury.total_earned = treasury.total_earned
        .checked_add(treasury_amount)
        .ok_or(SenError::ArithmeticOverflow)?;

    // Update vault stats
    vault.total_fees = vault.total_fees
        .checked_add(fee_amount)
        .ok_or(SenError::ArithmeticOverflow)?;

    // Emit payment event
    emit!(PaymentMade {
        sensor: ctx.accounts.sensor.key(),
        buyer: ctx.accounts.buyer.key(),
        amount,
        payment_type: "query".to_string(),
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
