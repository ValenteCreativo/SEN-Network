use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;

use errors::*;
use events::*;
use instructions::*;
use state::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod sen_network {
    use super::*;

    /// Register a new sensor device
    /// Creates Sensor PDA, Treasury PDA, and Reputation PDA
    pub fn register_sensor(
        ctx: Context<RegisterSensor>,
        sensor_id: String,
        sensor_type: String,
        metadata: String,
    ) -> Result<()> {
        instructions::register_sensor::handler(ctx, sensor_id, sensor_type, metadata)
    }

    /// Submit a reading hash to the blockchain
    /// Emits event for off-chain indexing
    pub fn submit_hash(
        ctx: Context<SubmitHash>,
        reading_hash: [u8; 32],
        timestamp: i64,
    ) -> Result<()> {
        instructions::submit_hash::handler(ctx, reading_hash, timestamp)
    }

    /// Pay-per-query access to sensor data
    /// Transfers USDC from buyer to treasury (95%) and vault (5% fee)
    pub fn pay_per_query(
        ctx: Context<PayPerQuery>,
        amount: u64,
    ) -> Result<()> {
        instructions::pay_per_query::handler(ctx, amount)
    }

    /// Subscribe to a sensor with monthly/yearly plan
    /// Creates Subscription PDA and processes initial payment
    pub fn subscribe(
        ctx: Context<Subscribe>,
        plan_type: String,
        amount: u64,
    ) -> Result<()> {
        instructions::subscribe::handler(ctx, plan_type, amount)
    }

    /// Withdraw earnings from sensor treasury
    /// Owner can withdraw accumulated USDC
    pub fn withdraw_earnings(
        ctx: Context<WithdrawEarnings>,
        amount: u64,
    ) -> Result<()> {
        instructions::withdraw_earnings::handler(ctx, amount)
    }

    /// Update sensor reputation score
    /// Only callable by authorized reputation oracle
    pub fn update_reputation(
        ctx: Context<UpdateReputation>,
        score_delta: i32,
    ) -> Result<()> {
        instructions::update_reputation::handler(ctx, score_delta)
    }
}
