# Tonspack wallet system

This repo is to build a wallet bot on telegram with font-end call up sdk . To allows user in telegram to use Dapp in EVM/SOL/APT chains .

Currently Tonspack still works in centralized . It use BIP44 to generate privatekeys for Users in telegram . baseically it's just a hot wallet . so , don't keep lots of asserts in it , it's not fully decentralized and safe enough.

However , now we are working with [lit-protocol](https://www.litprotocol.com/) to makes it to be MPC wallet . Which means it will be decentralized in future with Telegram Oauth social login . 

## Features

- Chains support 
  - EVM (all with different chainId)
  - Solana
  - TON
  - Aptos
  - Cosmos (all with different chian)

- Font-end callup SDK
  - windows.etherum / windows.solana optional hijack (On Telegram-webapp)
  - Walletconnect
  - Tonconnect
  - Dev sdk