// Smart Contract ABI dan konfigurasi untuk Garosta Goat NFT
// Deployed on Mantle L2 Network

export const CONTRACT_ADDRESSES = {
  testnet: "0x0000000000000000000000000000000000000000", // Mantle Sepolia
  mainnet: "0x0000000000000000000000000000000000000000", // Mantle Mainnet
}

export const GOAT_NFT_ABI = [
  // Read Functions
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "ownerOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "owner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "goats",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "rfid", type: "string" },
      { name: "goatName", type: "string" },
      { name: "weight", type: "uint256" },
      { name: "price", type: "uint256" },
      { name: "isForSale", type: "bool" },
      { name: "goatOwner", type: "address" },
    ],
  },
  {
    name: "getGoat",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_tokenId", type: "uint256" }],
    outputs: [
      { name: "rfid", type: "string" },
      { name: "goatName", type: "string" },
      { name: "weight", type: "uint256" },
      { name: "price", type: "uint256" },
      { name: "isForSale", type: "bool" },
      { name: "goatOwner", type: "address" },
    ],
  },
  // Write Functions
  {
    name: "mintGoat",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "_rfid", type: "string" },
      { name: "_goatName", type: "string" },
      { name: "_weight", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "listForSale",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_tokenId", type: "uint256" },
      { name: "_price", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "cancelListing",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_tokenId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "buyGoat",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "_tokenId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  // Events
  {
    name: "GoatMinted",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "mintedTo", type: "address", indexed: true },
      { name: "rfid", type: "string", indexed: false },
      { name: "price", type: "uint256", indexed: false },
    ],
  },
  {
    name: "GoatListed",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "price", type: "uint256", indexed: false },
    ],
  },
  {
    name: "GoatSold",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "price", type: "uint256", indexed: false },
    ],
  },
  {
    name: "Transfer",
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
] as const

export const GOAT_NFT_CONTRACT = {
  address: CONTRACT_ADDRESSES.testnet,
  abi: GOAT_NFT_ABI,
}

// Helper to get contract address based on network
export function getContractAddress(networkType: "mainnet" | "testnet"): string {
  return CONTRACT_ADDRESSES[networkType]
}

// Marketplace contract untuk trading
export const MARKETPLACE_CONTRACT = {
  address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",

  abi: [
    {
      name: "listItem",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "nftContract", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "price", type: "uint256" },
      ],
      outputs: [],
    },
    {
      name: "buyItem",
      type: "function",
      stateMutability: "payable",
      inputs: [
        { name: "nftContract", type: "address" },
        { name: "tokenId", type: "uint256" },
      ],
      outputs: [],
    },
    {
      name: "cancelListing",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "nftContract", type: "address" },
        { name: "tokenId", type: "uint256" },
      ],
      outputs: [],
    },
    {
      name: "getListing",
      type: "function",
      stateMutability: "view",
      inputs: [
        { name: "nftContract", type: "address" },
        { name: "tokenId", type: "uint256" },
      ],
      outputs: [
        { name: "seller", type: "address" },
        { name: "price", type: "uint256" },
      ],
    },
  ],
}

// Helper function to encode function calls
export function encodeFunctionData(abi: any[], functionName: string, args: any[]): string {
  const func = abi.find((item) => item.name === functionName && item.type === "function")
  if (!func) throw new Error(`Function ${functionName} not found in ABI`)

  // Simple ABI encoding (in production use ethers.js or viem)
  const selector = getFunctionSelector(functionName, func.inputs)
  const encodedArgs = encodeArguments(func.inputs, args)

  return selector + encodedArgs
}

function getFunctionSelector(name: string, inputs: any[]): string {
  const signature = `${name}(${inputs.map((i: any) => i.type).join(",")})`
  // This is a simplified version - in production use proper keccak256
  return "0x" + simpleHash(signature).slice(0, 8)
}

function encodeArguments(inputs: any[], args: any[]): string {
  return args
    .map((arg, i) => {
      const type = inputs[i].type
      if (type === "uint256") {
        return BigInt(arg).toString(16).padStart(64, "0")
      }
      if (type === "address") {
        return arg.slice(2).padStart(64, "0")
      }
      if (type === "string") {
        const hex = Buffer.from(arg).toString("hex")
        return hex.padEnd(64, "0")
      }
      return arg
    })
    .join("")
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(8, "0")
}

// Convert MNT to Wei
export function toWei(mnt: number): bigint {
  return BigInt(Math.floor(mnt * 1e18))
}

// Convert Wei to MNT
export function fromWei(wei: bigint | string): number {
  const weiBigInt = typeof wei === "string" ? BigInt(wei) : wei
  return Number(weiBigInt) / 1e18
}

// Format price in MNT
export function formatMNT(wei: bigint | string): string {
  const mnt = fromWei(wei)
  if (mnt < 0.0001) {
    return mnt.toExponential(2) + " MNT"
  }
  return mnt.toFixed(4) + " MNT"
}
