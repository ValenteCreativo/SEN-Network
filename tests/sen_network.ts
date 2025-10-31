import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SenNetwork } from "../target/types/sen_network";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { assert } from "chai";

describe("sen_network", () => {
  // Configure the client
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SenNetwork as Program<SenNetwork>;

  // Test accounts
  let sensorOwner: Keypair;
  let buyer: Keypair;
  let usdcMint: PublicKey;
  let sensorPda: PublicKey;
  let treasuryPda: PublicKey;
  let reputationPda: PublicKey;
  let subscriptionPda: PublicKey;
  let vaultPda: PublicKey;

  const sensorId = "test-sensor-001";
  const sensorType = "Temperature";
  const metadata = JSON.stringify({ location: "San Francisco, CA" });

  before(async () => {
    // Generate test accounts
    sensorOwner = Keypair.generate();
    buyer = Keypair.generate();

    // Airdrop SOL to test accounts
    const airdropSig1 = await provider.connection.requestAirdrop(
      sensorOwner.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig1);

    const airdropSig2 = await provider.connection.requestAirdrop(
      buyer.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig2);

    // Create USDC mint
    usdcMint = await createMint(
      provider.connection,
      sensorOwner,
      sensorOwner.publicKey,
      null,
      6 // USDC has 6 decimals
    );

    // Derive PDAs
    [sensorPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("sensor"),
        sensorOwner.publicKey.toBuffer(),
        Buffer.from(sensorId),
      ],
      program.programId
    );

    [treasuryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), sensorPda.toBuffer()],
      program.programId
    );

    [reputationPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("rep"), sensorPda.toBuffer()],
      program.programId
    );

    [subscriptionPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("sub"),
        sensorPda.toBuffer(),
        buyer.publicKey.toBuffer(),
      ],
      program.programId
    );

    [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), usdcMint.toBuffer()],
      program.programId
    );

    console.log("Sensor PDA:", sensorPda.toString());
    console.log("Treasury PDA:", treasuryPda.toString());
    console.log("Reputation PDA:", reputationPda.toString());
  });

  it("Registers a sensor", async () => {
    const tx = await program.methods
      .registerSensor(sensorId, sensorType, metadata)
      .accounts({
        sensor: sensorPda,
        treasury: treasuryPda,
        reputation: reputationPda,
        owner: sensorOwner.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([sensorOwner])
      .rpc();

    console.log("Register sensor tx:", tx);

    // Fetch and verify sensor account
    const sensor = await program.account.sensor.fetch(sensorPda);
    assert.equal(sensor.owner.toString(), sensorOwner.publicKey.toString());
    assert.equal(sensor.sensorId, sensorId);
    assert.equal(sensor.sensorType, sensorType);
    assert.equal(sensor.status, 1); // active
    assert.equal(sensor.totalReadings.toNumber(), 0);

    // Verify treasury account
    const treasury = await program.account.treasury.fetch(treasuryPda);
    assert.equal(treasury.sensor.toString(), sensorPda.toString());
    assert.equal(treasury.owner.toString(), sensorOwner.publicKey.toString());
    assert.equal(treasury.totalEarned.toNumber(), 0);

    // Verify reputation account
    const reputation = await program.account.reputation.fetch(reputationPda);
    assert.equal(reputation.sensor.toString(), sensorPda.toString());
    assert.equal(reputation.score, 0);
    assert.equal(reputation.uptimePercentage, 10000); // 100.00%
  });

  it("Submits a reading hash", async () => {
    // Create a mock reading hash
    const readingHash = Buffer.from(
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      "hex"
    );
    const timestamp = Math.floor(Date.now() / 1000);

    const tx = await program.methods
      .submitHash(Array.from(readingHash), new anchor.BN(timestamp))
      .accounts({
        sensor: sensorPda,
        reputation: reputationPda,
        owner: sensorOwner.publicKey,
      })
      .signers([sensorOwner])
      .rpc();

    console.log("Submit hash tx:", tx);

    // Verify counters incremented
    const sensor = await program.account.sensor.fetch(sensorPda);
    assert.equal(sensor.totalReadings.toNumber(), 1);

    const reputation = await program.account.reputation.fetch(reputationPda);
    assert.equal(reputation.totalReadings.toNumber(), 1);
  });

  it("Updates reputation score", async () => {
    const scoreDelta = 50;

    const tx = await program.methods
      .updateReputation(scoreDelta)
      .accounts({
        sensor: sensorPda,
        reputation: reputationPda,
        authority: sensorOwner.publicKey,
      })
      .signers([sensorOwner])
      .rpc();

    console.log("Update reputation tx:", tx);

    const reputation = await program.account.reputation.fetch(reputationPda);
    assert.equal(reputation.score, scoreDelta);
  });

  // Note: Payment and subscription tests require initialized token accounts
  // which would make this test file significantly longer. They are tested
  // in integration tests with full setup.
});
