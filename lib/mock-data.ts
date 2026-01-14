export interface GoatNFT {
  nftId: string
  rfid: string
  name: string
  age: number
  weightHistory: { week: number; weight: number }[]
  health: "Healthy" | "Under Monitoring"
  cost: number
  value: number
  owner: string
  mintDate: string
  contractAddress: string
  tokenId: number
  image: string
  healthLogs: { date: string; note: string }[]
  feedCost: number
  medicineCost: number
}

export const goatsData: GoatNFT[] = [
  {
    nftId: "GOAT-001",
    rfid: "RFID-88901",
    name: "Bella",
    age: 18,
    weightHistory: [
      { week: 1, weight: 20 },
      { week: 2, weight: 22 },
      { week: 3, weight: 24 },
      { week: 4, weight: 25 },
      { week: 5, weight: 27 },
      { week: 6, weight: 29 },
      { week: 7, weight: 31 },
      { week: 8, weight: 32 },
    ],
    health: "Healthy",
    cost: 0.0005,
    value: 0.001,
    owner: "0x1234...5678",
    mintDate: "2025-08-15",
    contractAddress: "0xGoatNFT...Contract",
    tokenId: 1,
    image: "/white-goat-farm-animal-portrait.jpg",
    healthLogs: [
      { date: "2025-12-01", note: "Regular checkup - healthy" },
      { date: "2025-11-15", note: "Vaccination completed" },
      { date: "2025-10-20", note: "Weight gain on track" },
    ],
    feedCost: 0.0003,
    medicineCost: 0.00005,
  },
  {
    nftId: "GOAT-002",
    rfid: "RFID-88902",
    name: "Rocky",
    age: 14,
    weightHistory: [
      { week: 1, weight: 18 },
      { week: 2, weight: 20 },
      { week: 3, weight: 21 },
      { week: 4, weight: 23 },
      { week: 5, weight: 25 },
      { week: 6, weight: 26 },
    ],
    health: "Healthy",
    cost: 0.0004,
    value: 0.0008,
    owner: "0x8765...4321",
    mintDate: "2025-09-20",
    contractAddress: "0xGoatNFT...Contract",
    tokenId: 2,
    image: "/brown-goat-farm-animal-portrait.jpg",
    healthLogs: [
      { date: "2025-12-05", note: "Regular checkup - healthy" },
      { date: "2025-11-20", note: "Deworming completed" },
    ],
    feedCost: 0.00025,
    medicineCost: 0.00003,
  },
  {
    nftId: "GOAT-003",
    rfid: "RFID-88903",
    name: "Luna",
    age: 12,
    weightHistory: [
      { week: 1, weight: 15 },
      { week: 2, weight: 16 },
      { week: 3, weight: 17 },
      { week: 4, weight: 18 },
      { week: 5, weight: 19 },
    ],
    health: "Under Monitoring",
    cost: 0.0003,
    value: 0.0006,
    owner: "0x2468...1357",
    mintDate: "2025-10-10",
    contractAddress: "0xGoatNFT...Contract",
    tokenId: 3,
    image: "/spotted-goat-farm-animal-portrait.jpg",
    healthLogs: [
      { date: "2025-12-08", note: "Slight appetite decrease - monitoring" },
      { date: "2025-12-01", note: "Weight gain slower than expected" },
      { date: "2025-11-25", note: "Regular checkup" },
    ],
    feedCost: 0.0002,
    medicineCost: 0.00006,
  },
  {
    nftId: "GOAT-004",
    rfid: "RFID-88904",
    name: "Max",
    age: 16,
    weightHistory: [
      { week: 1, weight: 22 },
      { week: 2, weight: 24 },
      { week: 3, weight: 26 },
      { week: 4, weight: 28 },
      { week: 5, weight: 30 },
      { week: 6, weight: 32 },
      { week: 7, weight: 34 },
    ],
    health: "Healthy",
    cost: 0.00045,
    value: 0.0011,
    owner: "0x9876...5432",
    mintDate: "2025-08-25",
    contractAddress: "0xGoatNFT...Contract",
    tokenId: 4,
    image: "/black-goat-farm-animal-portrait.jpg",
    healthLogs: [
      { date: "2025-12-03", note: "Excellent health condition" },
      { date: "2025-11-18", note: "Vaccination completed" },
    ],
    feedCost: 0.00028,
    medicineCost: 0.00004,
  },
  {
    nftId: "GOAT-005",
    rfid: "RFID-88905",
    name: "Daisy",
    age: 10,
    weightHistory: [
      { week: 1, weight: 12 },
      { week: 2, weight: 14 },
      { week: 3, weight: 16 },
      { week: 4, weight: 17 },
    ],
    health: "Healthy",
    cost: 0.00025,
    value: 0.0005,
    owner: "0x1357...2468",
    mintDate: "2025-11-01",
    contractAddress: "0xGoatNFT...Contract",
    tokenId: 5,
    image: "/young-goat-kid-farm-animal-portrait.jpg",
    healthLogs: [
      { date: "2025-12-06", note: "Growing well" },
      { date: "2025-11-25", note: "Initial health check - excellent" },
    ],
    feedCost: 0.00015,
    medicineCost: 0.00002,
  },
  {
    nftId: "GOAT-006",
    rfid: "RFID-88906",
    name: "Duke",
    age: 20,
    weightHistory: [
      { week: 1, weight: 25 },
      { week: 2, weight: 27 },
      { week: 3, weight: 29 },
      { week: 4, weight: 31 },
      { week: 5, weight: 33 },
      { week: 6, weight: 35 },
      { week: 7, weight: 36 },
      { week: 8, weight: 38 },
      { week: 9, weight: 39 },
    ],
    health: "Healthy",
    cost: 0.0006,
    value: 0.0012,
    owner: "0x3691...4826",
    mintDate: "2025-07-10",
    contractAddress: "0xGoatNFT...Contract",
    tokenId: 6,
    image: "/large-adult-goat-farm-animal-portrait.jpg",
    healthLogs: [
      { date: "2025-12-02", note: "Prime condition - ready for sale" },
      { date: "2025-11-15", note: "Final vaccination round" },
    ],
    feedCost: 0.00035,
    medicineCost: 0.00005,
  },
]

export const financialData = {
  totalAssetValue: 0.0062,
  totalCost: 0.003,
  totalRevenue: 0.008,
  netProfit: 0.005,
  profitPerNFT: 0.00083,
  expenses: {
    feed: 0.00153,
    medicine: 0.00025,
    labor: 0.001,
    infrastructure: 0.0003,
  },
  dividendHistory: [
    { date: "2025-12-01", amountPerNFT: 0.00015, totalDistributed: 0.0009 },
    { date: "2025-10-01", amountPerNFT: 0.00012, totalDistributed: 0.00072 },
    { date: "2025-08-01", amountPerNFT: 0.0001, totalDistributed: 0.0006 },
  ],
}
