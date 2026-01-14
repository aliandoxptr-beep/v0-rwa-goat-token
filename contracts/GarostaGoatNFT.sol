// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GarostaGoatNFT
 * @dev RWA NFT contract for tokenizing real goats on Mantle L2
 * @author Garosta Team
 */
contract GarostaGoatNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId;
    
    // Goat data structure
    struct GoatData {
        string rfid;
        string name;
        uint256 birthDate;
        uint256 weight;
        string breed;
        bool isListed;
        uint256 price;
        uint256 createdAt;
    }
    
    // Mapping from token ID to goat data
    mapping(uint256 => GoatData) public goats;
    
    // Mapping from RFID to token ID (to prevent duplicate RFIDs)
    mapping(string => uint256) public rfidToTokenId;
    
    // Mint fee (can be 0 for testnet)
    uint256 public mintFee = 0.001 ether;
    
    // Platform fee percentage (2.5%)
    uint256 public platformFeePercent = 250;
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Events
    event GoatMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string rfid,
        string name,
        uint256 value
    );
    
    event GoatListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    
    event GoatDelisted(
        uint256 indexed tokenId,
        address indexed seller
    );
    
    event GoatSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );
    
    event GoatWeightUpdated(
        uint256 indexed tokenId,
        uint256 oldWeight,
        uint256 newWeight
    );
    
    constructor() ERC721("Garosta Goat NFT", "GOAT") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new goat NFT
     * @param rfid Unique RFID of the goat
     * @param name Name of the goat
     * @param birthDate Birth date as unix timestamp
     * @param weight Weight in grams
     * @param breed Breed of the goat
     * @param uri Token URI for metadata
     */
    function mintGoat(
        string memory rfid,
        string memory name,
        uint256 birthDate,
        uint256 weight,
        string memory breed,
        string memory uri
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= mintFee, "Insufficient mint fee");
        require(bytes(rfid).length > 0, "RFID cannot be empty");
        require(rfidToTokenId[rfid] == 0, "RFID already registered");
        
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        
        goats[tokenId] = GoatData({
            rfid: rfid,
            name: name,
            birthDate: birthDate,
            weight: weight,
            breed: breed,
            isListed: false,
            price: msg.value,
            createdAt: block.timestamp
        });
        
        rfidToTokenId[rfid] = tokenId + 1; // +1 to differentiate from default 0
        
        emit GoatMinted(tokenId, msg.sender, rfid, name, msg.value);
        
        return tokenId;
    }
    
    /**
     * @dev List goat for sale
     * @param tokenId Token ID to list
     * @param price Sale price in wei
     */
    function listForSale(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        require(!goats[tokenId].isListed, "Already listed");
        
        goats[tokenId].isListed = true;
        goats[tokenId].price = price;
        
        emit GoatListed(tokenId, msg.sender, price);
    }
    
    /**
     * @dev Cancel listing
     * @param tokenId Token ID to delist
     */
    function cancelListing(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(goats[tokenId].isListed, "Not listed");
        
        goats[tokenId].isListed = false;
        
        emit GoatDelisted(tokenId, msg.sender);
    }
    
    /**
     * @dev Buy a listed goat
     * @param tokenId Token ID to buy
     */
    function buyGoat(uint256 tokenId) external payable nonReentrant {
        GoatData storage goat = goats[tokenId];
        require(goat.isListed, "Not for sale");
        require(msg.value >= goat.price, "Insufficient payment");
        
        address seller = ownerOf(tokenId);
        require(seller != msg.sender, "Cannot buy your own goat");
        
        // Calculate fees
        uint256 platformFee = (goat.price * platformFeePercent) / FEE_DENOMINATOR;
        uint256 sellerAmount = goat.price - platformFee;
        
        // Update state before transfer
        goat.isListed = false;
        
        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);
        
        // Transfer funds
        (bool success, ) = payable(seller).call{value: sellerAmount}("");
        require(success, "Transfer to seller failed");
        
        // Refund excess payment
        if (msg.value > goat.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - goat.price}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit GoatSold(tokenId, seller, msg.sender, goat.price);
    }
    
    /**
     * @dev Update goat weight (only owner)
     * @param tokenId Token ID to update
     * @param newWeight New weight in grams
     */
    function updateWeight(uint256 tokenId, uint256 newWeight) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        uint256 oldWeight = goats[tokenId].weight;
        goats[tokenId].weight = newWeight;
        
        emit GoatWeightUpdated(tokenId, oldWeight, newWeight);
    }
    
    /**
     * @dev Get goat data
     * @param tokenId Token ID to query
     */
    function getGoatData(uint256 tokenId) external view returns (
        string memory rfid,
        string memory name,
        uint256 birthDate,
        uint256 weight,
        string memory breed,
        bool isListed,
        uint256 price,
        uint256 createdAt
    ) {
        GoatData storage goat = goats[tokenId];
        return (
            goat.rfid,
            goat.name,
            goat.birthDate,
            goat.weight,
            goat.breed,
            goat.isListed,
            goat.price,
            goat.createdAt
        );
    }
    
    /**
     * @dev Get listing price
     * @param tokenId Token ID to query
     */
    function getListingPrice(uint256 tokenId) external view returns (uint256) {
        require(goats[tokenId].isListed, "Not listed");
        return goats[tokenId].price;
    }
    
    /**
     * @dev Get total supply
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }
    
    /**
     * @dev Set mint fee (only owner)
     * @param newFee New mint fee in wei
     */
    function setMintFee(uint256 newFee) external onlyOwner {
        mintFee = newFee;
    }
    
    /**
     * @dev Set platform fee percentage (only owner)
     * @param newFeePercent New fee percentage (basis points)
     */
    function setPlatformFeePercent(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 1000, "Fee too high"); // Max 10%
        platformFeePercent = newFeePercent;
    }
    
    /**
     * @dev Withdraw platform fees (only owner)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
