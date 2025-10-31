use anchor_lang::prelude::*;

/// Sensor account - stores sensor metadata and configuration
/// sensor_id: max 32 bytes ASCII for PDA seed compatibility
#[account]
pub struct Sensor {
    pub owner: Pubkey,           // Sensor owner wallet
    pub sensor_id: String,       // Unique sensor identifier (max 32 bytes ASCII)
    pub sensor_type: String,     // Sensor type (max 20 chars)
    pub metadata: String,        // JSON metadata (max 200 chars)
    pub treasury: Pubkey,        // Treasury PDA for this sensor
    pub reputation: Pubkey,      // Reputation PDA for this sensor
    pub status: u8,              // 0=pending, 1=active, 2=suspended
    pub total_readings: u64,     // Total readings submitted
    pub created_at: i64,         // Unix timestamp
    pub bump: u8,                // PDA bump seed
}

impl Sensor {
    pub const MAX_SIZE: usize = 8 + // discriminator
        32 +    // owner
        (4 + 32) + // sensor_id (max 32 bytes)
        (4 + 20) + // sensor_type
        (4 + 200) + // metadata
        32 +    // treasury
        32 +    // reputation
        1 +     // status
        8 +     // total_readings
        8 +     // created_at
        1;      // bump

    pub const MAX_SENSOR_ID_LEN: usize = 32;
}

/// Treasury account - holds USDC earnings for a sensor
#[account]
pub struct Treasury {
    pub sensor: Pubkey,          // Parent sensor PDA
    pub owner: Pubkey,           // Sensor owner (can withdraw)
    pub total_earned: u64,       // Total USDC earned (in lamports)
    pub total_withdrawn: u64,    // Total USDC withdrawn
    pub bump: u8,                // PDA bump seed
}

impl Treasury {
    pub const MAX_SIZE: usize = 8 + // discriminator
        32 +    // sensor
        32 +    // owner
        8 +     // total_earned
        8 +     // total_withdrawn
        1;      // bump
}

/// Subscription account - tracks active subscriptions
#[account]
pub struct Subscription {
    pub sensor: Pubkey,          // Sensor PDA
    pub buyer: Pubkey,           // Subscriber wallet
    pub plan_type: String,       // "monthly" | "yearly"
    pub amount: u64,             // USDC amount per period
    pub active: bool,            // Subscription status
    pub started_at: i64,         // Unix timestamp
    pub expires_at: i64,         // Unix timestamp
    pub bump: u8,                // PDA bump seed
}

impl Subscription {
    pub const MAX_SIZE: usize = 8 + // discriminator
        32 +    // sensor
        32 +    // buyer
        (4 + 20) + // plan_type
        8 +     // amount
        1 +     // active
        8 +     // started_at
        8 +     // expires_at
        1;      // bump
}

/// Reputation account - tracks sensor reliability
#[account]
pub struct Reputation {
    pub sensor: Pubkey,          // Parent sensor PDA
    pub score: i32,              // Reputation score (-1000 to +1000)
    pub uptime_percentage: u16,  // Uptime % (0-10000 = 0.00%-100.00%)
    pub total_readings: u64,     // Total readings submitted
    pub verified_readings: u64,  // Successfully verified readings
    pub flagged_count: u32,      // Spam/outlier flags
    pub last_updated: i64,       // Unix timestamp
    pub bump: u8,                // PDA bump seed
}

impl Reputation {
    pub const MAX_SIZE: usize = 8 + // discriminator
        32 +    // sensor
        4 +     // score
        2 +     // uptime_percentage
        8 +     // total_readings
        8 +     // verified_readings
        4 +     // flagged_count
        8 +     // last_updated
        1;      // bump
}

/// Program Vault - collects platform fees
#[account]
pub struct ProgramVault {
    pub authority: Pubkey,       // Vault authority (program upgrade authority)
    pub usdc_mint: Pubkey,       // USDC token mint
    pub total_fees: u64,         // Total fees collected
    pub treasury_fee_bps: u16,   // Treasury fee in basis points (9500 = 95%)
    pub vault_fee_bps: u16,      // Vault fee in basis points (500 = 5%)
    pub bump: u8,                // PDA bump seed
}

impl ProgramVault {
    pub const MAX_SIZE: usize = 8 + // discriminator
        32 +    // authority
        32 +    // usdc_mint
        8 +     // total_fees
        2 +     // treasury_fee_bps
        2 +     // vault_fee_bps
        1;      // bump

    pub const DEFAULT_TREASURY_FEE_BPS: u16 = 9500; // 95%
    pub const DEFAULT_VAULT_FEE_BPS: u16 = 500;     // 5%
}

/// Reputation update cooldown (5 minutes)
pub const REPUTATION_UPDATE_COOLDOWN: i64 = 300;

// PDA seed constants
pub const SENSOR_SEED: &[u8] = b"sensor";
pub const TREASURY_SEED: &[u8] = b"treasury";
pub const SUBSCRIPTION_SEED: &[u8] = b"sub";
pub const REPUTATION_SEED: &[u8] = b"rep";
pub const VAULT_SEED: &[u8] = b"vault";
