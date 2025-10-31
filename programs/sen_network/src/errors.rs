use anchor_lang::prelude::*;

#[error_code]
pub enum SenError {
    #[msg("Sensor ID too long (max 32 bytes ASCII)")]
    SensorIdTooLong,

    #[msg("Sensor ID contains invalid characters (ASCII only)")]
    SensorIdInvalidChars,

    #[msg("Sensor type too long (max 20 characters)")]
    SensorTypeTooLong,

    #[msg("Metadata too long (max 200 characters)")]
    MetadataTooLong,

    #[msg("Sensor is not active")]
    SensorNotActive,

    #[msg("Unauthorized: only sensor owner can perform this action")]
    Unauthorized,

    #[msg("Insufficient funds in treasury")]
    InsufficientFunds,

    #[msg("Invalid subscription plan type")]
    InvalidPlanType,

    #[msg("Subscription already exists")]
    SubscriptionExists,

    #[msg("Subscription has expired")]
    SubscriptionExpired,

    #[msg("Invalid amount: must be greater than zero")]
    InvalidAmount,

    #[msg("Reputation score out of range")]
    ReputationOutOfRange,

    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,

    #[msg("Invalid timestamp")]
    InvalidTimestamp,

    #[msg("Invalid token mint: only whitelisted USDC accepted")]
    InvalidMint,

    #[msg("Reputation update cooldown active (5 minutes between updates)")]
    ReputationCooldown,
}
