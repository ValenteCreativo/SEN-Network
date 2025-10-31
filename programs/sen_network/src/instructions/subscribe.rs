use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::{errors::*, events::*, state::*};

#[derive(Accounts)]
pub struct Subscribe<'info> {
    #[account(
        seeds = [SENSOR_SEED, sensor.owner.as_ref(), sensor.sensor_id.as_bytes()],
        bump = sensor.bump,
        constraint = sensor.status == 1 @ SenError::SensorNotActive
    )]
    pub sensor: Account<'info, Sensor>,

    #[account(
        init,
        payer = buyer,
        space = Subscription::MAX_SIZE,
        seeds = [SUBSCRIPTION_SEED, sensor.key().as_ref(), buyer.key().as_ref()],
        bump
    )]
    pub subscription: Account<'info, Subscription>,

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
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<Subscribe>,
    plan_type: String,
    amount: u64,
) -> Result<()> {
    require!(amount > 0, SenError::InvalidAmount);
    require!(
        plan_type == "monthly" || plan_type == "yearly",
        SenError::InvalidPlanType
    );

    let subscription = &mut ctx.accounts.subscription;
    let treasury = &mut ctx.accounts.treasury;
    let vault = &mut ctx.accounts.vault;
    let clock = Clock::get()?;

    // Calculate expiration (30 days for monthly, 365 days for yearly)
    let duration_days = if plan_type == "monthly" { 30 } else { 365 };
    let expires_at = clock.unix_timestamp
        .checked_add(duration_days * 24 * 60 * 60)
        .ok_or(SenError::ArithmeticOverflow)?;

    // Initialize subscription
    subscription.sensor = ctx.accounts.sensor.key();
    subscription.buyer = ctx.accounts.buyer.key();
    subscription.plan_type = plan_type.clone();
    subscription.amount = amount;
    subscription.active = true;
    subscription.started_at = clock.unix_timestamp;
    subscription.expires_at = expires_at;
    subscription.bump = ctx.bumps.subscription;

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

    // Emit subscription event
    emit!(SubscriptionUpdated {
        sensor: ctx.accounts.sensor.key(),
        buyer: ctx.accounts.buyer.key(),
        plan_type,
        amount,
        expires_at,
        timestamp: clock.unix_timestamp,
    });

    // Emit payment event
    emit!(PaymentMade {
        sensor: ctx.accounts.sensor.key(),
        buyer: ctx.accounts.buyer.key(),
        amount,
        payment_type: "subscription".to_string(),
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
