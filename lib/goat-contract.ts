// Smart Contract ABI dan konfigurasi untuk RWA Goat NFT
// Deployed on Mantle L2 Network

export const GOAT_NFT_CONTRACT = {
  // Contract address di Mantle Mainnet (mock untuk demo)
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00",

  // Contract ABI untuk interaksi dengan NFT
  abi: [
    // Read Functions
    {
      name: "balanceOf",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "owner", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
    },
    {
      name: "ownerOf",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "tokenId", type: "uint256" }],
      outputs: [{ name: "", type: "address" }],
    },
    {
      name: "tokenURI",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "tokenId", type: "uint256" }],
      outputs: [{ name: "", type: "string" }],
    },
    {
      name: "getGoatData",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "tokenId", type: "uint256" }],
      outputs: [
        { name: "rfid", type: "string" },
        { name: "name", type: "string" },
        { name: "birthDate", type: "uint256" },
        { name: "weight", type: "uint256" },
        { name: "isListed", type: "bool" },
        { name: "price", type: "uint256" },
      ],
    },
    {
      name: "getListingPrice",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "tokenId", type: "uint256" }],
      outputs: [{ name: "", type: "uint256" }],
    },
    // Write Functions
    {
      name: "mintGoat",
      type: "function",
      stateMutability: "payable",
      inputs: [
        { name: "rfid", type: "string" },
        { name: "name", type: "string" },
        { name: "birthDate", type: "uint256" },
        { name: "weight", type: "uint256" },
        { name: "uri", type: "string" },
      ],
      outputs: [{ name: "tokenId", type: "uint256" }],
    },
    {
      name: "listForSale",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "tokenId", type: "uint256" },
        { name: "price", type: "uint256" },
      ],
      outputs: [],
    },
    {
      name: "cancelListing",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [{ name: "tokenId", type: "uint256" }],
      outputs: [],
    },
    {
      name: "buyGoat",
      type: "function",
      stateMutability: "payable",
      inputs: [{ name: "tokenId", type: "uint256" }],
      outputs: [],
    },
    {
      name: "updateWeight",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "tokenId", type: "uint256" },
        { name: "newWeight", type: "uint256" },
      ],
      outputs: [],
    },
    // Events
    {
      name: "GoatMinted",
      type: "event",
      inputs: [
        { name: "tokenId", type: "uint256", indexed: true },
        { name: "owner", type: "address", indexed: true },
        { name: "rfid", type: "string", indexed: false },
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
        { name: "seller", type: "address", indexed: true },
        { name: "buyer", type: "address", indexed: true },
        { name: "price", type: "uint256", indexed: false },
      ],
    },
  ],
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
export function toWei(mnt: number): string {
  return BigInt(Math.floor(mnt * 1e18)).toString()
}

// Convert Wei to MNT
export function fromWei(wei: string): number {
  return Number(BigInt(wei)) / 1e18
}

// Format price in MNT
export function formatMNT(wei: string): string {
  const mnt = fromWei(wei)
  return mnt.toFixed(4) + " MNT"
}
