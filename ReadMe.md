# 🛰️ **SEN Network — Sensor Economy Network**
### **Decentralized Real-World Data Marketplace on Solana**

![Solana](https://img.shields.io/badge/Solana-Blockchain-6F00FF?logo=solana)
![Anchor](https://img.shields.io/badge/Anchor-v0.30.1-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)
![Redis](https://img.shields.io/badge/Redis-queues-b71c1c?logo=redis)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Docker](https://img.shields.io/badge/Docker-compose-2496ED?logo=docker)
![License](https://img.shields.io/badge/license-MIT-blue)

> **The trust layer for physical reality.**  
AI needs verified data. Sensors need incentives.  
Markets need trust.  
SEN turns the physical world into a **verifiable economy of data flows** — powered by Solana and cryptographic proofs.

---

## 📑 **Table of Contents**

- [Context](#-context)
- [Architecture](#-architecture)
- [On-Chain Modules](#-on-chain-modules)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Install & Setup](#-install--setup)
- [Local Development](#-local-development)
- [Project Structure](#-project-structure)
- [Useful Commands](#-useful-commands)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)

---

## 🎯 **Context**

### 🚨 The Problem
- Real-world data is **not verifiable**
- IoT networks are **centralized & siloed**
- Sensors lack **economic incentives**
- AI relies on closed & untrusted feeds
- Environmental data is **opaque and gatekept**

### ✅ The Solution — SEN Network
A decentralized **Sensor Data Marketplace** where:

| Actor | Capability |
|---|---|
🌎 **Sensor Owners** | Register sensors & stream signed data  
🏙️ **Builders / Researchers / AI Systems** | Purchase or subscribe to feeds  
⚡ **Solana** | Fast micropayments, trust guarantees  
🔐 **Backend** | Data ingest, validation, reputation  

> *Sensors become economic agents.*  
> *Data becomes an asset class.*

**Welcome to the Sensor Economy.**

---

 ┌──────────────┐       ┌────────────────────┐
 │  Sensors      │ ---->│  SEN Backend        │----┐
 │  IoT / DIY    │      │  Fastify + Prisma   │    │
 └──────┬────────┘      └───────┬────────────┘    │
        │                       Workers (BullMQ)   │
        ▼                                          ▼
   IPFS Storage       ◄── Blockchain Anchors ◄── Solana Program (Anchor)
        │                     (hash, payments, reputation)
        ▼                                          │
 ┌──────────────┐       ┌────────────────────┐     │
 │ Frontend     │<─────▶│ WebSockets + REST  │◄────┘
 │ Next.js      │       └────────────────────┘
 └──────────────┘

### Key Features
- Sensor registration (on-chain PDA)
- Proof-of-data hash commitment
- Pay-per-query + subscriptions
- Treasury (95%) & network vault (5%)
- Realtime WebSockets (incoming telemetry)
- Reputation engine
- Mock sensor scripts for testing

---

## 🧩 **On-Chain Modules (Anchor)**

| Module | Purpose |
|---|---|
`register_sensor` | Creates PDA + metadata  
`submit_hash` | Commits SHA-256 hash of sensor feed  
`pay_per_query` | USDC micropayment engine  
`subscribe` | Access subscription w/ renewal cycle  
`withdraw_earnings` | Withdraw accumulated funds  
`update_reputation` | Maintains integrity score  

### State Accounts
- **Sensor**
- **Subscription**
- **Treasury**
- **Vault**
- **Reputation**

> Zero governance, no memecoin gimmicks — **pure utility & infra**.

---

## 🧰 **Technology Stack**

### Blockchain
- Solana
- Anchor 0.30.1
- SPL USDC
- PDA-based account system

### Backend
- Fastify
- Prisma + PostgreSQL
- Redis + BullMQ workers
- IPFS (web3.storage)
- Zod validation
- Structured logging (Pino)

### Frontend
- Next.js 14 (App Router)
- Tailwind + Radix UI
- Zustand state
- Wallet Adapter (Phantom)
- Charts + dashboards

---

## 🛠️ **Prerequisites**

node >= 18
docker + docker compose
solana-cli >= 2.x (Agave stack)
anchor-cli >= 0.30.1

```bash

Verify setup:

solana --version
anchor --version
docker --version

```

---

```bash

## ⚙️ **Install & Setup**

Clone repo:

git clone <repo-url>
cd sen-network
pnpm install
docker compose up -d

```
```bash

Set devnet:

solana config set --url https://api.devnet.solana.com
solana airdrop 2

```
---

## 🧱 **Anchor Program Deployment**

```bash

Build:

anchor build

makefile
Copiar código

Deploy:

anchor deploy



Copy IDL to frontend:

cp target/idl/sen_network.json app/lib/idl/



Update program ID in:

- `Anchor.toml`
- `app/lib/idl/sen_network.json`

```

---

```bash
## 💻 **Local Development**

Backend:

pnpm dev:server

makefile
Copiar código

Frontend:

cd app
pnpm dev

yaml
Copiar código

Open browser → `http://localhost:3000`

```
---

## 📂 **Project Structure**

sen-network/
├─ programs/sen_network/ # Solana smart contract
├─ backend/
│ ├─ src/
│ │ ├─ server.ts # Fastify API
│ │ ├─ workers/ # BullMQ jobs
│ │ └─ prisma/ # Database schema
└─ app/ # Next.js Marketplace UI



---

## 🧪 **Useful Commands**

```bash

solana-test-validator # local chain
solana-keygen new # new wallet
anchor build --idl # rebuild IDL
cp target/idl/*.json app/lib/idl/ # sync IDL to UI
docker compose restart # infra reset

```
---

## 🩹 **Troubleshooting**

| Issue | Fix |
|---|---|
Wallet not connecting | Phantom → enable Devnet |
IDL missing | `anchor build && cp idl` |
Program mismatch | Update `Anchor.toml` & UI IDL |
Docker errors | `docker compose down && docker compose up` |

---

## 🛣️ **Roadmap**

✅ Phase 1 — MVP  
- Sensor registry
- Data proof hashing
- Wallet connect UI
- Mock data ingest + charts

🚀 Phase 2 — Real-World Readiness  
- Live sensor firmware script
- Strong reputation scoring
- USDC subscriptions
- ZK-based data integrity (optional)

🌍 Phase 3 — Scale  
- Mobile app
- LoRaWAN gateway integration
- Community sensor kits (Raspberry Pi)
- Municipal + research partnerships

> **Goal: AI-ready real-world data rails.**

---

## 🐾 **Author**

**Valentín Martínez**  
Builder — Solana | DePIN | AI | Cyberpunk Panther 🐆⚡️  

github.com/valentinmartinez

```bash

MIT License — **Open source for planetary intelligence & resilience 🌍**s

```