import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import CONTRACT_ADDRESS from '../lib/contract'
import usdtAbi from '../lib/usdtABI.json'

const Web3Context = createContext()
export const useWeb3 = () => useContext(Web3Context)

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState()
  const [signer, setSigner] = useState()
  const [address, setAddress] = useState()
  const [contract, setContract] = useState()
  const [error, setError] = useState()

  const init = async () => {
    if (!window.ethereum) {
      setError('MetaMask not detected. Please install it.')
      return
    }
    try {
      const eth = window.ethereum
      const web3Provider = new ethers.providers.Web3Provider(eth)
      setProvider(web3Provider)
      const accounts = await web3Provider.send('eth_requestAccounts', [])
      setAddress(accounts[0])
      const s = web3Provider.getSigner()
      setSigner(s)
      setContract(new ethers.Contract(CONTRACT_ADDRESS, usdtAbi, s))
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { init() }, [])

  return (
    <Web3Context.Provider value={{ provider, signer, address, contract, error }}>
      {children}
    </Web3Context.Provider>
  )
}
