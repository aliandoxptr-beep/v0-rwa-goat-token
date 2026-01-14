# How to Deploy SimpleGarostaGoat Contract

## Step 1: Get Test MNT
1. Go to https://faucet.sepolia.mantle.xyz
2. Enter your wallet address: `0x48e390cf960497142e6724637e5edd288ea911f2`
3. Click "Request" to get free test MNT

## Step 2: Deploy via Remix IDE

1. Open https://remix.ethereum.org

2. Create new file: `SimpleGarostaGoat.sol`

3. Copy paste this code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
    
    function mintGoat(
        string memory _rfid,
        string memory _goatName,
        uint256 _weight
    ) external payable returns (uint256) {
        require(msg.value >= 0.0001 ether, "Min 0.0001 MNT");
        
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
    
    function listForSale(uint256 _tokenId, uint256 _price) external {
        require(goats[_tokenId].goatOwner == msg.sender, "Not owner");
        require(_price > 0, "Price > 0");
        
        goats[_tokenId].isForSale = true;
        goats[_tokenId].price = _price;
        
        emit GoatListed(_tokenId, _price);
    }
    
    function cancelListing(uint256 _tokenId) external {
        require(goats[_tokenId].goatOwner == msg.sender, "Not owner");
        goats[_tokenId].isForSale = false;
    }
    
    function buyGoat(uint256 _tokenId) external payable {
        Goat storage goat = goats[_tokenId];
        require(goat.isForSale, "Not for sale");
        require(msg.value >= goat.price, "Insufficient MNT");
        require(goat.goatOwner != msg.sender, "Already yours");
        
        address seller = goat.goatOwner;
        uint256 salePrice = goat.price;
        
        balanceOf[seller]--;
        balanceOf[msg.sender]++;
        goat.goatOwner = msg.sender;
        goat.isForSale = false;
        
        payable(seller).transfer(salePrice);
        
        if (msg.value > salePrice) {
            payable(msg.sender).transfer(msg.value - salePrice);
        }
        
        emit GoatSold(_tokenId, seller, msg.sender, salePrice);
        emit Transfer(seller, msg.sender, _tokenId);
    }
    
    function getGoat(uint256 _tokenId) external view returns (
        string memory, string memory, uint256, uint256, bool, address
    ) {
        Goat storage g = goats[_tokenId];
        return (g.rfid, g.goatName, g.weight, g.price, g.isForSale, g.goatOwner);
    }
    
    function ownerOf(uint256 _tokenId) external view returns (address) {
        require(_tokenId < totalSupply, "Not exist");
        return goats[_tokenId].goatOwner;
    }
    
    function withdraw() external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }
}
```

4. Click "Solidity Compiler" tab (left sidebar)
   - Select compiler version: 0.8.20
   - Click "Compile SimpleGarostaGoat.sol"

5. Click "Deploy & Run Transactions" tab
   - Environment: "Injected Provider - MetaMask"
   - Make sure MetaMask is connected to Mantle Sepolia (Chain ID: 5003)
   - Click "Deploy"
   - Confirm transaction in MetaMask

6. Copy the deployed contract address (shown under "Deployed Contracts")

## Step 3: Update Frontend

After deployment, update the contract address in your app:

1. Open `lib/goat-contract.ts`
2. Replace the testnet address:

```ts
export const CONTRACT_ADDRESSES = {
  testnet: "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE",
  mainnet: "0x0000000000000000000000000000000000000000",
}
```

## Step 4: Test Transactions

1. Go to your Garosta app dashboard
2. Click "Add Goat"
3. Fill in goat details and click "Mint NFT"
4. Confirm transaction in MetaMask
5. Your goat NFT should appear in the dashboard!

## Mantle Sepolia Network Config

- Network Name: Mantle Sepolia Testnet
- RPC URL: https://rpc.sepolia.mantle.xyz
- Chain ID: 5003
- Currency: MNT
- Explorer: https://sepolia.mantlescan.xyz
