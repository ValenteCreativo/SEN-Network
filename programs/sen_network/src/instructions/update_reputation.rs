use anchor_lang::prelude::*;
use crate::{errors::*, events::*, state::*};

#[derive(Accounts)]
pub struct UpdateReputation<'info> {
    #[account(
        seeds = [SENSOR_SEED, sensor.owner.as_ref(), sensor.sensor_id.as_bytes()],
        bump = sensor.bump
    )]
    pub sensor: Account<'info, Sensor>,

    #[account(
        mut,
        seeds = [REPUTATION_SEED, sensor.key().as_ref()],
        bump = reputation.bump
    )]
    pub reputation: Account<'info, Reputation>,

    /// TODO: Add oracle authority check in production
    /// For MVP, anyone can update (backend will be the caller)
    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<UpdateReputation>,
    score_delta: i32,
) -> Result<()> {
    let reputation = &mut ctx.accounts.reputation;
    let clock = Clock::get()?;

    // Store old score for event
    let old_score = reputation.score;

    // Apply score delta with bounds checking
    let new_score = reputation.score
        .checked_add(score_delta)
        .ok_or(SenError::ArithmeticOverflow)?;

    // Clamp score to [-1000, +1000] range
    let clamped_score = new_score.clamp(-1000, 1000);

    reputation.score = clamped_score;
    reputation.last_updated = clock.unix_timestamp;

    // Emit reputation update event
    emit!(ReputationUpdated {
        sensor: ctx.accounts.sensor.key(),
        old_score,
        new_score: clamped_score,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
