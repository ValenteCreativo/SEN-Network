import { create } from "zustand"

interface Sensor {
  id: string
  name: string
  type: "AQI" | "Temperature" | "Humidity" | "Traffic" | "Noise"
  status: "streaming" | "offline"
  lastReading: number
  earnings: number
  location: string
  owner: string
  uptime: number
  pricePerQuery: number
  monthlySubscription: number
}

interface AppState {
  isWalletConnected: boolean
  walletAddress: string
  totalEarnings: number
  activeSensors: number
  dataPurchased: number
  sensors: Sensor[]
  connectWallet: (address: string) => void
  disconnectWallet: () => void
  addSensor: (sensor: Sensor) => void
}

export const useStore = create<AppState>((set) => ({
  isWalletConnected: false,
  walletAddress: "",
  totalEarnings: 0,
  activeSensors: 0,
  dataPurchased: 0,
  sensors: [],
  connectWallet: (address) => set({ isWalletConnected: true, walletAddress: address }),
  disconnectWallet: () => set({ isWalletConnected: false, walletAddress: "" }),
  addSensor: (sensor) =>
    set((state) => ({
      sensors: [...state.sensors, sensor],
      activeSensors: state.activeSensors + 1,
    })),
}))
