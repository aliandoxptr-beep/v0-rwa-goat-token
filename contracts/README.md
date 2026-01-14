# Garosta Smart Contracts

Smart contracts for the Garosta RWA Goat NFT platform on Mantle L2.

## Prerequisites

- Node.js v18+
- npm or yarn
- A wallet with MNT for deployment (get testnet MNT from https://faucet.sepolia.mantle.xyz)

## Setup

1. Install dependencies:
```bash
cd contracts
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your private key to `.env` (the one with MNT for gas)

## Deploy to Mantle Sepolia Testnet

```bash
npm run deploy:testnet
```

## Deploy to Mantle Mainnet

```bash
npm run deploy:mainnet
```

## After Deployment

Copy the deployed contract address and update it in:
- \`lib/goat-contract.ts\` - Update \`GOAT_NFT_CONTRACT.address\`

## Contract Functions

### User Functions
- \`mintGoat(rfid, name, birthDate, weight, breed, uri)\` - Mint new goat NFT
- \`listForSale(tokenId, price)\` - List goat for sale
- \`cancelListing(tokenId)\` - Cancel listing
- \`buyGoat(tokenId)\` - Buy a listed goat
- \`updateWeight(tokenId, newWeight)\` - Update goat weight

### View Functions
- \`getGoatData(tokenId)\` - Get goat details
- \`getListingPrice(tokenId)\` - Get listing price
- \`totalSupply()\` - Get total minted goats
- \`ownerOf(tokenId)\` - Get owner of goat

## Network Info

### Mantle Sepolia (Testnet)
- Chain ID: 5003
- RPC: https://rpc.sepolia.mantle.xyz
- Explorer: https://explorer.sepolia.mantle.xyz
- Faucet: https://faucet.sepolia.mantle.xyz

### Mantle Mainnet
- Chain ID: 5000
- RPC: https://rpc.mantle.xyz
- Explorer: https://explorer.mantle.xyz
