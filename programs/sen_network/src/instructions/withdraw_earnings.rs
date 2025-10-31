use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::{errors::*, events::*, state::*};

#[derive(Accounts)]
pub struct WithdrawEarnings<'info> {
    #[account(
        seeds = [SENSOR_SEED, sensor.owner.as_ref(), sensor.sensor_id.as_bytes()],
        bump = sensor.bump,
        constraint = sensor.owner == owner.key() @ SenError::Unauthorized
    )]
    pub sensor: Account<'info, Sensor>,

    #[account(
        mut,
        seeds = [TREASURY_SEED, sensor.key().as_ref()],
        bump = treasury.bump,
        constraint = treasury.owner == owner.key() @ SenError::Unauthorized
    )]
    pub treasury: Account<'info, Treasury>,

    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = treasury
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub owner_token_account: Account<'info, TokenAccount>,

    pub usdc_mint: Account<'info, anchor_spl::token::Mint>,

    pub owner: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<WithdrawEarnings>,
    amount: u64,
) -> Result<()> {
    require!(amount > 0, SenError::InvalidAmount);

    let treasury = &mut ctx.accounts.treasury;
    let clock = Clock::get()?;

    // Check available balance
    let available = treasury.total_earned
        .checked_sub(treasury.total_withdrawn)
        .ok_or(SenError::ArithmeticOverflow)?;

    require!(amount <= available, SenError::InsufficientFunds);

    // Derive treasury PDA signer seeds
    let sensor_key = ctx.accounts.sensor.key();
    let seeds = &[
        TREASURY_SEED,
        sensor_key.as_ref(),
        &[treasury.bump],
    ];
    let signer_seeds = &[&seeds[..]];

    // Transfer from treasury to owner
    let transfer = Transfer {
        from: ctx.accounts.treasury_token_account.to_account_info(),
        to: ctx.accounts.owner_token_account.to_account_info(),
        authority: treasury.to_account_info(),
    };
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer,
            signer_seeds,
        ),
        amount,
    )?;

    // Update withdrawal stats
    treasury.total_withdrawn = treasury.total_withdrawn
        .checked_add(amount)
        .ok_or(SenError::ArithmeticOverflow)?;

    // Emit withdrawal event
    emit!(EarningsWithdrawn {
        sensor: ctx.accounts.sensor.key(),
        owner: ctx.accounts.owner.key(),
        amount,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
