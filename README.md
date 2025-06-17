# DeFi USDT Staking DApp (Proof of Concept)

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38bdf8)](https://tailwindcss.com/)
[![Smart Contract](https://img.shields.io/badge/Smart%20Contract-Unaudited-red)]()
[![Status](https://img.shields.io/badge/Project-Proof%20of%20Concept-yellow)]()

---

This is a **proof of concept** decentralized application for USDT staking on Ethereum-compatible networks. It includes:

- A simple Solidity smart contract for staking USDT and earning rewards
- A Next.js frontend with:
  - MetaMask wallet integration
  - Stake/Unstake interface
  - Real-time reward tracking
  - Transaction history via Etherscan API
- React Context for global state management
- Tailwind CSS for UI styling

---

## ⚠️ Security Disclaimer

> **This project is NOT production-ready.**

The included smart contract is unaudited and intended for demonstration purposes only. It should **not** be deployed on a mainnet or used with real funds without a full security review and professional auditing.

---

## 🔐 Contract Notes

- The current `USDTStaking.sol` contract is minimal and lacks real-world security patterns (e.g. reentrancy guards, pausability, upgradeability).
- For actual deployment, use a **verified and audited staking contract**, and implement comprehensive testing (unit, integration, fuzzing).

---

## Summary

This app showcases a basic working stack for DeFi staking mechanics with a frontend, smart contract, and user account integration. It serves as a reference for developers looking to build or learn about decentralized staking apps.
