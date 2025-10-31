// API Client for SEN Network Backend
// Set NEXT_PUBLIC_USE_MOCKS=true to use mock data without backend

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// =============================
// Types
// =============================

export interface Sensor {
  id: string;
  name: string;
  type: string;
  location?: string;
  ownerWallet: string;
  publicKey: string;
  onChainAddress?: string;
  pricePerQuery: number;
  monthlySubscription: number;
  status: string;
  createdAt: string;
}

export interface Reading {
  id: string;
  sensorId: string;
  timestamp: number;
  value: number;
  ipfsCid?: string;
  onChainHash?: string;
  signature: string;
  verified: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  sensorId: string;
  buyerWallet: string;
  planType: 'monthly' | 'yearly';
  amount: number;
  active: boolean;
  startedAt: string;
  expiresAt: string;
  txSignature?: string;
}

export interface MarketSensor {
  id: string;
  name: string;
  type: string;
  location?: string;
  pricePerQuery: number;
  monthlySubscription: number;
  reputation?: {
    score: number;
    uptime: number;
    totalReadings: number;
    verifiedReadings: number;
  };
}

// =============================
// Mock Data
// =============================

const MOCK_SENSORS: Sensor[] = [
  {
    id: 'sensor-1',
    name: 'Campus Temperature Sensor',
    type: 'temperature',
    location: 'Building A, Floor 3',
    ownerWallet: '7xKX...y8Qz',
    publicKey: 'ABC123...',
    pricePerQuery: 0.01,
    monthlySubscription: 5.0,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sensor-2',
    name: 'Air Quality Monitor',
    type: 'air_quality',
    location: 'Downtown Station',
    ownerWallet: '9xKX...a1Bz',
    publicKey: 'DEF456...',
    pricePerQuery: 0.02,
    monthlySubscription: 10.0,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

const MOCK_READINGS: Reading[] = [
  {
    id: 'reading-1',
    sensorId: 'sensor-1',
    timestamp: Date.now() - 3600000,
    value: 22.5,
    signature: 'sig123...',
    verified: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'reading-2',
    sensorId: 'sensor-1',
    timestamp: Date.now(),
    value: 23.1,
    signature: 'sig456...',
    verified: true,
    createdAt: new Date().toISOString(),
  },
];

const MOCK_MARKET_SENSORS: MarketSensor[] = MOCK_SENSORS.map((s) => ({
  id: s.id,
  name: s.name,
  type: s.type,
  location: s.location,
  pricePerQuery: s.pricePerQuery,
  monthlySubscription: s.monthlySubscription,
  reputation: {
    score: 850,
    uptime: 99.5,
    totalReadings: 1000,
    verifiedReadings: 995,
  },
}));

// =============================
// API Functions
// =============================

export async function registerSensor(data: {
  name: string;
  type: string;
  location?: string;
  publicKey: string;
  pricePerQuery: number;
  monthlySubscription: number;
}): Promise<Sensor> {
  if (USE_MOCKS) {
    console.log('[MOCK] registerSensor:', data);
    return {
      id: `sensor-${Date.now()}`,
      ...data,
      ownerWallet: 'mock-wallet',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
  }

  const response = await fetch(`${API_BASE_URL}/sensors/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to register sensor: ${response.statusText}`);
  }

  return response.json();
}

export async function uploadReading(data: {
  sensorId: string;
  timestamp: number;
  value: number;
  signature: string;
}): Promise<Reading> {
  if (USE_MOCKS) {
    console.log('[MOCK] uploadReading:', data);
    return {
      id: `reading-${Date.now()}`,
      ...data,
      verified: true,
      createdAt: new Date().toISOString(),
    };
  }

  const response = await fetch(`${API_BASE_URL}/readings/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to upload reading: ${response.statusText}`);
  }

  return response.json();
}

export async function getSensorReadings(sensorId: string, accessToken: string): Promise<Reading[]> {
  if (USE_MOCKS) {
    console.log('[MOCK] getSensorReadings:', { sensorId, accessToken });
    return MOCK_READINGS.filter((r) => r.sensorId === sensorId);
  }

  const response = await fetch(`${API_BASE_URL}/readings/${sensorId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch readings: ${response.statusText}`);
  }

  return response.json();
}

export async function getMarketSensors(): Promise<MarketSensor[]> {
  if (USE_MOCKS) {
    console.log('[MOCK] getMarketSensors');
    return MOCK_MARKET_SENSORS;
  }

  const response = await fetch(`${API_BASE_URL}/market/sensors`);

  if (!response.ok) {
    throw new Error(`Failed to fetch market sensors: ${response.statusText}`);
  }

  return response.json();
}

export async function subscribe(data: {
  sensorId: string;
  planType: 'monthly' | 'yearly';
  buyerWallet: string;
  txSignature: string;
}): Promise<Subscription> {
  if (USE_MOCKS) {
    console.log('[MOCK] subscribe:', data);
    return {
      id: `sub-${Date.now()}`,
      sensorId: data.sensorId,
      buyerWallet: data.buyerWallet,
      planType: data.planType,
      amount: data.planType === 'monthly' ? 5.0 : 50.0,
      active: true,
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      txSignature: data.txSignature,
    };
  }

  const response = await fetch(`${API_BASE_URL}/subscriptions/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to subscribe: ${response.statusText}`);
  }

  return response.json();
}

export async function healthCheck(): Promise<{ status: string }> {
  if (USE_MOCKS) {
    console.log('[MOCK] healthCheck');
    return { status: 'ok (mock)' };
  }

  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }

  return response.json();
}
