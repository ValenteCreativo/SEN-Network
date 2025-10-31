use anchor_lang::prelude::*;
use crate::{errors::*, events::*, state::*};

#[derive(Accounts)]
pub struct SubmitHash<'info> {
    #[account(
        mut,
        seeds = [SENSOR_SEED, sensor.owner.as_ref(), sensor.sensor_id.as_bytes()],
        bump = sensor.bump,
        constraint = sensor.status == 1 @ SenError::SensorNotActive,
        constraint = sensor.owner == owner.key() @ SenError::Unauthorized
    )]
    pub sensor: Account<'info, Sensor>,

    #[account(
        mut,
        seeds = [REPUTATION_SEED, sensor.key().as_ref()],
        bump = reputation.bump
    )]
    pub reputation: Account<'info, Reputation>,

    pub owner: Signer<'info>,
}

pub fn handler(
    ctx: Context<SubmitHash>,
    reading_hash: [u8; 32],
    timestamp: i64,
) -> Result<()> {
    let sensor = &mut ctx.accounts.sensor;
    let reputation = &mut ctx.accounts.reputation;
    let clock = Clock::get()?;

    // Validate timestamp is not in the future
    require!(timestamp <= clock.unix_timestamp, SenError::InvalidTimestamp);

    // Increment reading counters
    sensor.total_readings = sensor.total_readings
        .checked_add(1)
        .ok_or(SenError::ArithmeticOverflow)?;

    reputation.total_readings = reputation.total_readings
        .checked_add(1)
        .ok_or(SenError::ArithmeticOverflow)?;

    reputation.last_updated = clock.unix_timestamp;

    // Emit reading event for off-chain indexing
    emit!(ReadingSubmitted {
        sensor: sensor.key(),
        reading_hash,
        timestamp,
        total_readings: sensor.total_readings,
    });

    Ok(())
}
