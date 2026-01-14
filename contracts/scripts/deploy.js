const { ethers } = require("hardhat")

async function main() {
  console.log("🐐 Deploying Garosta Goat NFT Contract...\n")

  const [deployer] = await ethers.getSigners()
  console.log("Deploying with account:", deployer.address)

  const balance = await ethers.provider.getBalance(deployer.address)
  console.log("Account balance:", ethers.formatEther(balance), "MNT\n")

  // Deploy GarostaGoatNFT
  const GarostaGoatNFT = await ethers.getContractFactory("GarostaGoatNFT")
  const goatNFT = await GarostaGoatNFT.deploy()

  await goatNFT.waitForDeployment()
  const contractAddress = await goatNFT.getAddress()

  console.log("✅ GarostaGoatNFT deployed to:", contractAddress)
  console.log("\n📝 Update your web3-config.ts with this address:")
  console.log(`   GOAT_NFT_CONTRACT.address = "${contractAddress}"`)

  // Set mint fee to 0.001 MNT for testnet
  const mintFee = ethers.parseEther("0.001")
  await goatNFT.setMintFee(mintFee)
  console.log("\n💰 Mint fee set to:", ethers.formatEther(mintFee), "MNT")

  console.log("\n🎉 Deployment complete!")
  console.log("\n--- Contract Info ---")
  console.log("Name:", await goatNFT.name())
  console.log("Symbol:", await goatNFT.symbol())
  console.log("Owner:", await goatNFT.owner())

  return contractAddress
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
