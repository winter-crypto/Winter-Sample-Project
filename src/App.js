import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import nftData from './NFTData.json';
import { WinterCheckout } from '@usewinter/checkout';


const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [showWinterModal, setShowWinterModal] = useState(false);

    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
        } else {
            console.log("No authorized account found");
        }
    }

    /*
    * Implement your connectWallet method here
    */
    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            /*
            * Fancy method to request access to account.
            */
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            /*
            * Boom! This should print out public address once we authorize Metamask.
            */
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    }

    const askContractToMintNft = async () => {
        const CONTRACT_ADDRESS = "0x8aBCB7f0f58fbc4c3b61bF7DF4613d62Cb5306F4"; // INSERT YOUR OWN CONTRACT

        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, nftData, signer);

                const options = {value: 100000000000000} // How much your NFT costs
                console.log("Going to pop wallet now to pay gas...")
                let nftTxn = await connectedContract.mintNFT('0xE29A94bDDfEf3DE77cdFdF85481776071a2Edf95', options);

                console.log("Mining...please wait.")
                await nftTxn.wait();

                console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Render Methods
    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
        </button>
    );

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    /*
    * Added a conditional render! We don't want to show Connect to Wallet if we're already connected :).
    */
    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">My NFT Collection</p>
                    <p className="sub-text">
                        Each unique. Each beautiful. Discover your NFT today.
                    </p>
                    {currentAccount === "" ? (
                        renderNotConnectedContainer()
                    ) : (
                        <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                            Mint NFT
                        </button>
                    )}

                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <button onClick={() => {setShowWinterModal(true)}} className="cta-button connect-wallet-button">
                        Mint with card
                    </button>
                    <WinterCheckout
                        projectId={1102}
                        production={false}
                        // A variable you keep track of on your front end for when to trigger showing Winter's modal!
                        showModal={showWinterModal}
                        // testnet need when production is false
                        testnet={'goerli'}

                        onClose={() => setShowWinterModal(false)}
                    />
                </div>

            </div>
        </div>
    );
};

export default App;