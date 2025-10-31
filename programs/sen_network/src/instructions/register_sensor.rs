use anchor_lang::prelude::*;
use crate::{errors::*, events::*, state::*};

#[derive(Accounts)]
#[instruction(sensor_id: String)]
pub struct RegisterSensor<'info> {
    #[account(
        init,
        payer = owner,
        space = Sensor::MAX_SIZE,
        seeds = [SENSOR_SEED, owner.key().as_ref(), sensor_id.as_bytes()],
        bump
    )]
    pub sensor: Account<'info, Sensor>,

    #[account(
        init,
        payer = owner,
        space = Treasury::MAX_SIZE,
        seeds = [TREASURY_SEED, sensor.key().as_ref()],
        bump
    )]
    pub treasury: Account<'info, Treasury>,

    #[account(
        init,
        payer = owner,
        space = Reputation::MAX_SIZE,
        seeds = [REPUTATION_SEED, sensor.key().as_ref()],
        bump
    )]
    pub reputation: Account<'info, Reputation>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<RegisterSensor>,
    sensor_id: String,
    sensor_type: String,
    metadata: String,
) -> Result<()> {
    // Validate input lengths
    require!(sensor_id.len() <= 50, SenError::SensorIdTooLong);
    require!(sensor_type.len() <= 20, SenError::SensorTypeTooLong);
    require!(metadata.len() <= 200, SenError::MetadataTooLong);

    let sensor = &mut ctx.accounts.sensor;
    let treasury = &mut ctx.accounts.treasury;
    let reputation = &mut ctx.accounts.reputation;
    let clock = Clock::get()?;

    // Initialize sensor account
    sensor.owner = ctx.accounts.owner.key();
    sensor.sensor_id = sensor_id.clone();
    sensor.sensor_type = sensor_type.clone();
    sensor.metadata = metadata;
    sensor.treasury = treasury.key();
    sensor.reputation = reputation.key();
    sensor.status = 1; // active
    sensor.total_readings = 0;
    sensor.created_at = clock.unix_timestamp;
    sensor.bump = ctx.bumps.sensor;

    // Initialize treasury account
    treasury.sensor = sensor.key();
    treasury.owner = ctx.accounts.owner.key();
    treasury.total_earned = 0;
    treasury.total_withdrawn = 0;
    treasury.bump = ctx.bumps.treasury;

    // Initialize reputation account
    reputation.sensor = sensor.key();
    reputation.score = 0;
    reputation.uptime_percentage = 10000; // 100.00%
    reputation.total_readings = 0;
    reputation.verified_readings = 0;
    reputation.flagged_count = 0;
    reputation.last_updated = clock.unix_timestamp;
    reputation.bump = ctx.bumps.reputation;

    // Emit registration event
    emit!(SensorRegistered {
        sensor: sensor.key(),
        owner: ctx.accounts.owner.key(),
        sensor_id,
        sensor_type,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
