// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleGarostaGoat
 * @dev Simple NFT contract for Garosta - Easy to deploy on Remix IDE
 * @notice Copy this to Remix IDE and deploy to Mantle Sepolia
 */
contract SimpleGarostaGoat {
    string public name = "Garosta Goat";
    string public symbol = "GOAT";
    
    uint256 public totalSupply;
    address public owner;
    
    struct Goat {
        string rfid;
        string goatName;
        uint256 weight;
        uint256 price;
        bool isForSale;
        address goatOwner;
    }
    
    mapping(uint256 => Goat) public goats;
    mapping(address => uint256) public balanceOf;
    
    event GoatMinted(uint256 indexed tokenId, address indexed mintedTo, string rfid, uint256 price);
    event GoatListed(uint256 indexed tokenId, uint256 price);
    event GoatSold(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    
    constructor() {
        owner = msg.sender;
    }
    
    // Mint new goat NFT - pay MNT to mint
    function mintGoat(
        string memory _rfid,
        string memory _goatName,
        uint256 _weight
    ) external payable returns (uint256) {
        require(msg.value >= 0.0001 ether, "Min 0.0001 MNT required");
        
        uint256 tokenId = totalSupply;
        totalSupply++;
        
        goats[tokenId] = Goat({
            rfid: _rfid,
            goatName: _goatName,
            weight: _weight,
            price: msg.value,
            isForSale: false,
            goatOwner: msg.sender
        });
        
        balanceOf[msg.sender]++;
        
        emit GoatMinted(tokenId, msg.sender, _rfid, msg.value);
        emit Transfer(address(0), msg.sender, tokenId);
        
        return tokenId;
    }
    
    // List goat for sale
    function listForSale(uint256 _tokenId, uint256 _price) external {
        require(goats[_tokenId].goatOwner == msg.sender, "Not owner");
        require(_price > 0, "Price must be > 0");
        
        goats[_tokenId].isForSale = true;
        goats[_tokenId].price = _price;
        
        emit GoatListed(_tokenId, _price);
    }
    
    // Cancel listing
    function cancelListing(uint256 _tokenId) external {
        require(goats[_tokenId].goatOwner == msg.sender, "Not owner");
        goats[_tokenId].isForSale = false;
    }
    
    // Buy goat - send MNT to buy
    function buyGoat(uint256 _tokenId) external payable {
        Goat storage goat = goats[_tokenId];
        require(goat.isForSale, "Not for sale");
        require(msg.value >= goat.price, "Insufficient MNT");
        require(goat.goatOwner != msg.sender, "Already yours");
        
        address seller = goat.goatOwner;
        uint256 salePrice = goat.price;
        
        // Update ownership
        balanceOf[seller]--;
        balanceOf[msg.sender]++;
        goat.goatOwner = msg.sender;
        goat.isForSale = false;
        
        // Pay seller
        payable(seller).transfer(salePrice);
        
        // Refund excess
        if (msg.value > salePrice) {
            payable(msg.sender).transfer(msg.value - salePrice);
        }
        
        emit GoatSold(_tokenId, seller, msg.sender, salePrice);
        emit Transfer(seller, msg.sender, _tokenId);
    }
    
    // Get goat info
    function getGoat(uint256 _tokenId) external view returns (
        string memory rfid,
        string memory goatName,
        uint256 weight,
        uint256 price,
        bool isForSale,
        address goatOwner
    ) {
        Goat storage g = goats[_tokenId];
        return (g.rfid, g.goatName, g.weight, g.price, g.isForSale, g.goatOwner);
    }
    
    // Check owner of token
    function ownerOf(uint256 _tokenId) external view returns (address) {
        require(_tokenId < totalSupply, "Token does not exist");
        return goats[_tokenId].goatOwner;
    }
    
    // Withdraw contract balance (only owner)
    function withdraw() external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }
}
