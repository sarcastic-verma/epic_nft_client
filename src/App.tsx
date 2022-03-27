import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";

// Constants
const TWITTER_HANDLE = 'dard_hayy_disco';
const TWITTER_LINK = `https://twitter.com/${ TWITTER_HANDLE }`;
// const OPENSEA_LINK = '';
// const TOTAL_MINT_COUNT = 50;

const App = () => {
    const [ currentAccount, setCurrentAccount ] = useState();

    const checkIfWalletIsConnected = async () => {
        if ( !( window as any ).ethereum ) {
            console.log("Make sure you have metamask!");
            return;
        }

        const { ethereum } = window as any;

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
        }
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window as any;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            setCurrentAccount(accounts[0]);

        } catch ({ message }) {
            alert(message);
        }
    }

    // Render Methods
    const renderNotConnectedContainer = () => (
        <button onClick={!currentAccount ? connectWallet : () => {alert("Happy shopping!")}} className="cta-button connect-wallet-button">
            { !currentAccount ? "Connect to Wallet" : `Connected to Wallet ${currentAccount}` }
        </button>
    );


    useEffect(() => {
        checkIfWalletIsConnected().then();
    }, [])

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">My NFT Collection</p>
                    <p className="sub-text">
                        Each unique. Each beautiful. Discover your NFT today.
                    </p>
                    { renderNotConnectedContainer() }
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
