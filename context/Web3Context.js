// context/Web3Context.js
import React, { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import usdtABI from '../lib/usdtABI.json';
import stakingABI from '../lib/stakingABI.json';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [usdtContract, setUsdtContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const usdtAddress = process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS;
  const stakingAddress = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS;
  const targetNetworkId = '0x1'; // Ethereum Mainnet

  const initWeb3 = async (prov) => {
    const web3Instance = new Web3(prov);
    setWeb3(web3Instance);

    const accounts = await web3Instance.eth.getAccounts();
    setAccount(accounts[0]);

    const usdt = new web3Instance.eth.Contract(usdtABI, usdtAddress);
    setUsdtContract(usdt);

    const staking = new web3Instance.eth.Contract(stakingABI, stakingAddress);
    setStakingContract(staking);
  };

  const connectWallet = async () => {
    let prov;

    if (window.ethereum) {
      prov = window.ethereum;
      try {
        await prov.request({ method: 'eth_requestAccounts' });
        await ensureCorrectNetwork(prov);
      } catch (err) {
        console.error('User denied wallet connection', err);
        return;
      }
    } else {
      prov = new WalletConnectProvider({
        rpc: {
          1: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
        },
      });
      await prov.enable();
    }

    setProvider(prov);
    await initWeb3(prov);
  };

  const disconnectWallet = async () => {
    setAccount(null);
    setWeb3(null);
    setUsdtContract(null);
    setStakingContract(null);

    if (provider?.disconnect) {
      await provider.disconnect();
    }

    setProvider(null);
    if (window.localStorage.getItem('walletconnect')) {
      window.localStorage.removeItem('walletconnect');
    }
  };

  const ensureCorrectNetwork = async (prov) => {
    const currentChainId = await prov.request({ method: 'eth_chainId' });
    if (currentChainId !== targetNetworkId) {
      try {
        await prov.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetNetworkId }],
        });
      } catch (err) {
        console.error('Network switch failed', err);
      }
    }
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        web3,
        account,
        connectWallet,
        disconnectWallet,
        usdtContract,
        stakingContract,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
