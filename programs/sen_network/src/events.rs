use anchor_lang::prelude::*;

/// Event emitted when a sensor is registered
#[event]
pub struct SensorRegistered {
    pub sensor: Pubkey,
    pub owner: Pubkey,
    pub sensor_id: String,
    pub sensor_type: String,
    pub timestamp: i64,
}

/// Event emitted when a reading hash is submitted
#[event]
pub struct ReadingSubmitted {
    pub sensor: Pubkey,
    pub reading_hash: [u8; 32],
    pub timestamp: i64,
    pub total_readings: u64,
}

/// Event emitted when a payment is made
#[event]
pub struct PaymentMade {
    pub sensor: Pubkey,
    pub buyer: Pubkey,
    pub amount: u64,
    pub payment_type: String, // "query" | "subscription"
    pub timestamp: i64,
}

/// Event emitted when a subscription is created or renewed
#[event]
pub struct SubscriptionUpdated {
    pub sensor: Pubkey,
    pub buyer: Pubkey,
    pub plan_type: String,
    pub amount: u64,
    pub expires_at: i64,
    pub timestamp: i64,
}

/// Event emitted when earnings are withdrawn
#[event]
pub struct EarningsWithdrawn {
    pub sensor: Pubkey,
    pub owner: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

/// Event emitted when reputation is updated
#[event]
pub struct ReputationUpdated {
    pub sensor: Pubkey,
    pub old_score: i32,
    pub new_score: i32,
    pub timestamp: i64,
}
