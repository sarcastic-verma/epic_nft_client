import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import EpicNft from './assets/EpicNFT.json';

// Constants
const TWITTER_HANDLE = 'dard_hayy_disco';
const TWITTER_LINK = `https://twitter.com/${ TWITTER_HANDLE }`;
const CONTRACT_ADDRESS = "0xD2F7461965734f5510f0c46901301fedd9d57e91";
const OPENSEA_LINK = `https://testnets.opensea.io/collection/squarenft-rysvr2vxdh`;

const App = () => {
    const [ currentAccount, setCurrentAccount ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ nftCount, setNftCount ] = useState(0);

    // Setup our listener.
    const setupEventListener = async () => {
        // Most of this looks the same as our function askContractToMintNft
        try {
            const { ethereum } = window as any;

            if ( ethereum ) {
                // Same stuff again
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, EpicNft.abi, signer);

                // THIS IS THE MAGIC SAUCE.
                // This will essentially "capture" our event when our contract throws it.
                // If you're familiar with webhooks, it's very similar to that!
                connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
                    console.log(from, tokenId.toNumber())
                    alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${ CONTRACT_ADDRESS }/${ tokenId.toNumber() }`)
                });

                console.log("Setup event listener!")

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch ( error ) {
            console.log(error)
        }
    }

    const askContractToMintNft = async () => {
        try {
            const { ethereum } = window as any;

            if ( ethereum ) {
                setLoading(true);
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, EpicNft.abi, signer);

                let nftTxn = await connectedContract.makeAnEpicNFT();

                await nftTxn.wait();

                let getTxn = await connectedContract.getCurrentNFTCount();

                setNftCount(getTxn.toNumber());

                alert(`Congratulations, your token is minted on ${ nftTxn.hash }`);
                setLoading(false);
            }
        } catch ( { message } ) {
            alert(message);
            setLoading(false);
        }
    }

    const getNftCount = async () => {
        try {
            const { ethereum } = window as any;

            if ( ethereum ) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, EpicNft.abi, signer);

                let nftTxn = await connectedContract.getCurrentNFTCount();

                setNftCount(nftTxn.toNumber());
            }
        } catch ( { message } ) {
            alert(message);
        }
    }

    const checkIfWalletIsConnected =  async () => {
        const { ethereum } = window as any;

        if ( !ethereum ) {
            alert("Make sure you have metamask!");
            return false;
        }

        let chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log("Connected to chain " + chainId);

// String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = "0x4";
        if ( chainId !== rinkebyChainId ) {
            alert("You are not connected to the Rinkeby Test Network!");
            return false;
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if ( accounts.length !== 0 ) {
            const account = accounts[0];
            setCurrentAccount(account);
            setupEventListener().then();
            return true;
        }

        return false;
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window as any;

            if ( !ethereum ) {
                alert("Get MetaMask!");
                return;
            }

            /*
            * Fancy method to request access to account.
            */
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            setCurrentAccount(accounts[0]);

            setupEventListener().then();

        } catch ( { message } ) {
            console.log(message);
        }
    }

    // Render Methods
    const renderNotConnectedContainer = () => (
        <button onClick={ connectWallet } className="cta-button connect-wallet-button">
            Connect to Wallet
        </button>
    );

    useEffect(() => {
        checkIfWalletIsConnected().then((val) => {
            if ( val )
                getNftCount().then();
        });
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
                    <p className="sub-text">
                        { nftCount !== undefined ? `${ nftCount }/50 already minted` : 'Fetching count...' }
                    </p>
                    { loading ? <div>Loading...</div> : currentAccount === "" ? renderNotConnectedContainer() :
                        <button onClick={ askContractToMintNft } className="cta-button connect-wallet-button">
                            Mint NFT
                        </button>
                    }
                </div>
                <div className="footer-container">
                    <a
                        className="footer-text"
                        href={ OPENSEA_LINK }
                        target="_blank"
                        rel="noreferrer"
                    >{ `View on OpenSea` }</a>
                </div>
                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src={ twitterLogo }/>
                    <a
                        className="footer-text"
                        href={ TWITTER_LINK }
                        target="_blank"
                        rel="noreferrer"
                    >{ `built by @${ TWITTER_HANDLE }` }</a>
                </div>
            </div>
        </div>
    );
};

export default App;
