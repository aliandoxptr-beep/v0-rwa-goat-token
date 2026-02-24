use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};
use mpl_token_metadata::accounts::Metadata;
use mpl_token_metadata::instruction::create_metadata_accounts_v3;
use solana_program::program::invoke;

declare_id!("GaroZEYx1234567890123456789012345678901234");

#[program]
pub mod garosta_goat_nft {
    use super::*;

    pub fn mint_goat_nft(
        ctx: Context<MintGoatNFT>,
        name: String,
        rfid: String,
        age: u8,
        weight: u16,
        goat_type: String,
    ) -> Result<()> {
        msg!("Minting Goat NFT: {}", name);

        // Mint 1 token
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        mint_to(cpi_ctx, 1)?;

        // Create metadata
        let metadata_uri = format!(
            "ipfs://QmGoatMetadata/garosta_{}_{}",
            ctx.accounts.mint.key(),
            name
        );

        let metadata_accounts = vec![
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ];

        let data = mpl_token_metadata::types::DataV2 {
            name: name.clone(),
            symbol: "GOAT".to_string(),
            uri: metadata_uri,
            seller_fee_basis_points: 500,
            creators: Some(vec![mpl_token_metadata::types::Creator {
                address: ctx.accounts.payer.key(),
                verified: true,
                share: 100,
            }]),
            collection: None,
            uses: None,
        };

        let instruction = create_metadata_accounts_v3(
            ctx.accounts.token_metadata_program.key(),
            ctx.accounts.metadata.key(),
            ctx.accounts.mint.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.payer.key(),
            name.clone(),
            "GAROSTA".to_string(),
            metadata_uri,
            Some(vec![mpl_token_metadata::types::Creator {
                address: ctx.accounts.payer.key(),
                verified: true,
                share: 100,
            }]),
            500,
            false,
            false,
            None,
            None,
            None,
        );

        invoke(
            &instruction,
            &metadata_accounts,
        )?;

        // Emit event
        emit!(GoatMinted {
            name,
            rfid,
            age,
            weight,
            goat_type,
            mint: ctx.accounts.mint.key(),
            owner: ctx.accounts.payer.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn buy_goat_nft(
        ctx: Context<BuyGoatNFT>,
        price: u64,
    ) -> Result<()> {
        msg!("Buying Goat NFT for {} lamports", price);

        // Transfer SOL from buyer to seller
        let transfer_instruction = solana_program::system_instruction::transfer(
            &ctx.accounts.buyer.key(),
            &ctx.accounts.seller.key(),
            price,
        );

        invoke(
            &transfer_instruction,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.seller.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // Transfer NFT from seller to buyer
        let token_transfer_instruction = anchor_spl::token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx.accounts.seller_token_account.to_account_info(),
                    to: ctx.accounts.buyer_token_account.to_account_info(),
                    authority: ctx.accounts.seller.to_account_info(),
                },
            ),
            1,
        );

        emit!(GoatPurchased {
            buyer: ctx.accounts.buyer.key(),
            seller: ctx.accounts.seller.key(),
            price,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintGoatNFT<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = payer,
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub token_account: Account<'info, TokenAccount>,

    /// CHECK: This is verified by the Token Metadata program
    pub metadata: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,

    /// CHECK: This is the Token Metadata program
    pub token_metadata_program: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct BuyGoatNFT<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub seller: AccountInfo<'info>,

    #[account(mut)]
    pub seller_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[event]
pub struct GoatMinted {
    pub name: String,
    pub rfid: String,
    pub age: u8,
    pub weight: u16,
    pub goat_type: String,
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct GoatPurchased {
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub price: u64,
    pub timestamp: i64,
}
