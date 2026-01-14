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
    cost: 9.5,
    value: 200,
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
    feedCost: 5.3,
    medicineCost: 0.95,
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
    cost: 7.5,
    value: 162.5,
    owner: "0x8765...4321",
    mintDate: "2025-09-20",
    contractAddress: "0xGoatNFT...Contract",
    tokenId: 2,
    image: "/brown-goat-farm-animal-portrait.jpg",
    healthLogs: [
      { date: "2025-12-05", note: "Regular checkup - healthy" },
      { date: "2025-11-20", note: "Deworming completed" },
    ],
    feedCost: 4.4,
    medicineCost: 0.63,
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
    cost: 6.25,
    value: 131.25,
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
    feedCost: 4.05,
    medicineCost: 1.25,
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
    cost: 8.75,
    value: 218.75,
    owner: "0x9876...5432",
    mintDate: "2025-08-25",
    contractAddress: "0xGoatNFT...Contract",
    tokenId: 4,
    image: "/black-goat-farm-animal-portrait.jpg",
    healthLogs: [
      { date: "2025-12-03", note: "Excellent health condition" },
      { date: "2025-11-18", note: "Vaccination completed" },
    ],
    feedCost: 5.63,
    medicineCost: 0.75,
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
    cost: 5.63,
    value: 112.5,
    owner: "0x1357...2468",
    mintDate: "2025-11-01",
    contractAddress: "0xGoatNFT...Contract",
    tokenId: 5,
    image: "/young-goat-kid-farm-animal-portrait.jpg",
    healthLogs: [
      { date: "2025-12-06", note: "Growing well" },
      { date: "2025-11-25", note: "Initial health check - excellent" },
    ],
    feedCost: 3.44,
    medicineCost: 0.5,
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
    cost: 11.25,
    value: 262.5,
    owner: "0x3691...4826",
    mintDate: "2025-07-10",
    contractAddress: "0xGoatNFT...Contract",
    tokenId: 6,
    image: "/large-adult-goat-farm-animal-portrait.jpg",
    healthLogs: [
      { date: "2025-12-02", note: "Prime condition - ready for sale" },
      { date: "2025-11-15", note: "Final vaccination round" },
    ],
    feedCost: 6.88,
    medicineCost: 0.88,
  },
]

export const financialData = {
  totalAssetValue: 1087.5,
  totalCost: 64,
  totalRevenue: 175,
  netProfit: 111,
  profitPerNFT: 18.5,
  expenses: {
    feed: 29.7,
    medicine: 4.94,
    labor: 21.88,
    infrastructure: 7.5,
  },
  dividendHistory: [
    { date: "2025-12-01", amountPerNFT: 2.81, totalDistributed: 16.88 },
    { date: "2025-10-01", amountPerNFT: 2.63, totalDistributed: 15.75 },
    { date: "2025-08-01", amountPerNFT: 2.38, totalDistributed: 14.25 },
  ],
}
