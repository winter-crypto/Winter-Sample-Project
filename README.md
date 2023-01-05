# Get started with Winter - an NFT checkout to buy/sell NFTs via credit & debit card!

Take a look at our website https://www.usewinter.com/

## Full Docs 

https://docs.usewinter.com/get-started/get-started

## What is this repo for?

This repo is a READY MADE template/sample project for you to get started with Winter's NFT checkout. All you need to do is fork this, get your own project ID (which can be obtained by creating a new test project at https://business.usewinter.com/), and replace the project ID!

Full React component docs https://docs.usewinter.com/front-end-integration/react


## Quick start guide

First do an `npm install`, replace the project ID on this line https://github.com/winter-crypto/Winter-Sample-Project/blob/main/src/App.js#L131, and then run `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser!

# Full steps

## Step 0: Get your NFT smart contract and deploy!

All smart contracts must have a mint function with an address parameter and be deployed (start first on a testnet, like Goerli)! Here’s a [Goerli faucet](https://goerlifaucet.com/) for some free testnet ETH! The address parameter is so that if a user wants to mint to their own wallet, we can do this in one transaction (save on gas fees and a faster mint)!

Bonus points: Set up your own NFT website & dapp with this [tutorial](https://docs.alchemy.com/docs/nft-minter) and the below contract!

Here’s a sample smart contract with a [guide](https://remix-ide.readthedocs.io/en/latest/create_deploy.html) on how to deploy it:

```jsx
//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract WorldOfTechCats is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 private MAX_TOKEN_SUPPLY = 500000000;
    uint256 public price = 100000000000000; // Cost per NFT is 0.0001 eth, about ~20 USD

    string private baseTokenURI = "ipfs://QmQxTMxsAtkNodUJ26mbtchsnqTekKqgDvkjnzWir4vTxZ/1";

    constructor() ERC721("WorldOfTechCats", "WorldOfTechCats") {}

    function mintNFT(address recipient)
        public payable
        returns (uint256)
    {
        
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        require(newItemId<=MAX_TOKEN_SUPPLY);
        require(msg.value == price, "Incorrect amount");
        _mint(recipient, newItemId);
        
        _setTokenURI(newItemId, string(abi.encodePacked(baseTokenURI, Strings.toString(newItemId))));

        return newItemId;
    }
}
```

## Step 1: Login to our dashboard & setup a project

(Full Winter Docs [https://docs.usewinter.com/get-started/get-started](https://docs.usewinter.com/get-started/get-started))

1. Login here [https://business.usewinter.com/](https://business.usewinter.com/)
2. Enter in your smart contract details 

- address - get this after you deploy!
- contract ABI - [how to get your contract ABI in remix](https://stackoverflow.com/questions/69269101/please-how-do-i-get-abi-of-my-token-after-deploying-on-bscmainet)
- mint function name - in the above example, it’s `mintNFT`
- mint function params - in the above address it’s just `address`

3. Try doing a test mint with a fake credit card! 

![Screen Shot 2022-09-18 at 5.23.46 PM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/22cbb2d2-d725-47e1-8557-a57809dc4ca1/Screen_Shot_2022-09-18_at_5.23.46_PM.png)

## Step 2: Integrate on your front end

React integration [https://docs.usewinter.com/front-end-integration/react](https://docs.usewinter.com/front-end-integration/react)

Option 1: Fork your a copy of our sample [dApp setup here](https://github.com/winter-crypto/Winter-Sample-Project)!

- Insert your own contract address
    
    ![Screen Shot 2022-12-21 at 9.08.39 PM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1779725c-5e6f-4697-a222-0ccc76a1abc3/Screen_Shot_2022-12-21_at_9.08.39_PM.png)
    
- Take your projectId and set it in projectId

![Screen Shot 2022-12-21 at 9.08.59 PM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0e4f93dc-b691-44e7-a949-1e40653bee47/Screen_Shot_2022-12-21_at_9.08.59_PM.png)

- And you’re good to go! `npm install` and `npm start`

Option 2: Install [Winter's checkout package](https://www.npmjs.com/package/@usewinter/checkout)

- `npm i @usewinter/checkout`
- Use the component in your React app

```jsx
import { WinterCheckout } from '@usewinter/checkout';

<WinterCheckout 
    projectId={YOUR_PROJECT_ID_FROM_WINTER} 
    production={false} 
    // A variable you keep track of on your front end for when to trigger showing Winter's modal!
    showModal={showWinter} 
    // testnet need when production is false
    testnet={'goerli'}
    // pass in a function to be called when a successful purchase happens
    onSuccess={() => setParty(true)}
    // pass in a function to be called when the modal is closed
    onClose={() => setShowWinter(false)}
    // Extra mint params are params besides 'address, amount, proof'
    // The key needs to exactly match the name of the param provided to Winter
    // The value will be passed in as the param
    extraMintParams={{tier: 'diamond', type: 'super-rare'}}
    // Price function params
    // The key needs to exactly match the name of the param provided to Winter
    // The value will be passed in as the param
    priceFunctionParams={{tier: 'gold', type: 'rare'}}
/>
```

## Step 3: Push to production!

Push your project to production!

https://www.loom.com/share/9ea1f91a995c436ab6269f1bbbe937e7
