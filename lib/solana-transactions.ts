import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from "@solana/spl-token"
import { NFT_PRICE_SOL, getSolanaExplorerUrl } from "./solana-config"

interface MintGoatNFTParams {
  connection: Connection
  payer: PublicKey
  provider: any
  name: string
  rfid: string
  age: number
  weight: number
  goatType: string
}

interface BuyGoatNFTParams {
  connection: Connection
  buyer: PublicKey
  seller: PublicKey
  provider: any
  nftMint: PublicKey
  price?: number // in SOL, defaults to NFT_PRICE_SOL
}

/**
 * Mint a new goat NFT on Solana
 * This creates a new SPL token (NFT with 0 decimals)
 */
export async function mintGoatNFT({
  connection,
  payer,
  provider,
  name,
  rfid,
  age,
  weight,
  goatType,
}: MintGoatNFTParams) {
  try {
    console.log("[v0] Starting goat NFT mint for:", name)

    // Create new mint
    const mint = await createMint(
      connection,
      new Keypair(), // This should be actual payer keypair in production
      payer,
      payer,
      0 // 0 decimals for NFT
    )

    console.log("[v0] Mint created:", mint.toBase58())

    // Get or create associated token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      new Keypair(),
      mint,
      payer
    )

    console.log("[v0] Token account created:", tokenAccount.address.toBase58())

    // Mint 1 token
    await mintTo(
      connection,
      new Keypair(),
      mint,
      tokenAccount.address,
      payer,
      1
    )

    console.log("[v0] NFT minted successfully")

    // Create transaction to send to wallet for signing
    const transaction = new Transaction()
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: new PublicKey("GarostaGoatTreasuryAddress123456789"),
        lamports: Math.floor(NFT_PRICE_SOL * LAMPORTS_PER_SOL),
      })
    )

    // Send transaction through wallet provider
    const { signature } = await provider.signAndSendTransaction(transaction)
    
    console.log("[v0] Transaction signature:", signature)

    return {
      success: true,
      mint: mint.toBase58(),
      tokenAccount: tokenAccount.address.toBase58(),
      signature,
      explorerUrl: getSolanaExplorerUrl("devnet", `tx/${signature}`),
    }
  } catch (error: any) {
    console.error("[v0] Mint error:", error.message)
    throw new Error(`Failed to mint goat NFT: ${error.message}`)
  }
}

/**
 * Buy a goat NFT on Solana
 * Transfers SOL to seller and NFT to buyer
 */
export async function buyGoatNFT({
  connection,
  buyer,
  seller,
  provider,
  nftMint,
  price = NFT_PRICE_SOL,
}: BuyGoatNFTParams) {
  try {
    console.log("[v0] Starting goat NFT purchase")
    console.log("[v0] Buyer:", buyer.toBase58())
    console.log("[v0] Seller:", seller.toBase58())
    console.log("[v0] Price:", price, "SOL")

    // Get buyer's associated token account
    const buyerTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      new Keypair(),
      nftMint,
      buyer
    )

    // Get seller's associated token account
    const sellerTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      new Keypair(),
      nftMint,
      seller
    )

    console.log("[v0] Token accounts ready")

    // Create transaction
    const transaction = new Transaction()

    // Add SOL transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: buyer,
        toPubkey: seller,
        lamports: Math.floor(price * LAMPORTS_PER_SOL),
      })
    )

    // Add NFT transfer instruction
    transaction.add(
      transfer(
        connection,
        new Keypair(),
        sellerTokenAccount.address,
        buyerTokenAccount.address,
        seller,
        1
      )
    )

    // Send transaction through wallet provider
    const { signature } = await provider.signAndSendTransaction(transaction)

    console.log("[v0] Purchase transaction signature:", signature)

    return {
      success: true,
      signature,
      buyerTokenAccount: buyerTokenAccount.address.toBase58(),
      sellerTokenAccount: sellerTokenAccount.address.toBase58(),
      explorerUrl: getSolanaExplorerUrl("devnet", `tx/${signature}`),
    }
  } catch (error: any) {
    console.error("[v0] Buy error:", error.message)
    throw new Error(`Failed to buy goat NFT: ${error.message}`)
  }
}

/**
 * Get NFT balance for a wallet
 */
export async function getNFTBalance(
  connection: Connection,
  walletAddress: PublicKey,
  nftMint: PublicKey
): Promise<number> {
  try {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      new Keypair(),
      nftMint,
      walletAddress
    )

    const balance = await connection.getTokenAccountBalance(tokenAccount.address)
    return balance.value.uiAmount || 0
  } catch (error) {
    console.error("Failed to get NFT balance:", error)
    return 0
  }
}

/**
 * Get all NFTs owned by a wallet (simplified - in production use metaplex)
 */
export async function getWalletNFTs(
  connection: Connection,
  walletAddress: PublicKey
): Promise<any[]> {
  try {
    const tokens = await connection.getParsedTokenAccountsByOwner(
      walletAddress,
      {
        programId: new PublicKey("TokenkegQfeZyiNwAJsyFbPVwwQQfփ6JFv"), // SPL Token Program
      }
    )

    return tokens.value
      .filter((token) => {
        const amount = token.account.data.parsed.info.tokenAmount.uiAmount
        return amount === 1 // NFTs have amount of 1
      })
      .map((token) => ({
        mint: token.account.data.parsed.info.mint,
        owner: token.pubkey.toBase58(),
        amount: token.account.data.parsed.info.tokenAmount.uiAmount,
      }))
  } catch (error) {
    console.error("Failed to get wallet NFTs:", error)
    return []
  }
}
