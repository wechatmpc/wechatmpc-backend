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

  ## Wallet connect base logic 

- Dapp generate a random key (32 lenght)
 
- Dapp params key into webapp link 

- Dapp loop call api interface with random Key for callback/webhook

- User open Webapp with generated link

- Tonspack server update information of callback address

Basically speaking , it requir for bot font-end & back-end to process the router . 

## Support font-end actions : 

**Absctruc**

- Connect 

Connect wallet . Retrun font-end user wallet address in hex / Timestamp .

Require : 1.ChainType  2.ChainId

- Sign Message

Sign message using privatekey . Return Message / Signed Message / Timestamp

Require : 1.ChainType  2.ChainId 3. PresignedMsg

- Sign And Send Transaction

Sign and send out transaction using privatekey into target chain

Require : 1.ChainType  2.ChainId 3. PreSendTransactions

```

/**
 * Router struct :
 * {
 * t : 0, // Action type . 0 connect  . 1 sign message . 2.sign and send transaction
 * d : {}. // Struct for different actions
 * }
 * 
 * Chain information struct
 * {
 * t:0 , // chain type . 0 evm , 1 solana , 2 ton , 3 aptos ,4 tron , 5 cosmos 
 * i:0 , // chain id 
 * }
 * 
 * //Wallet connect action
 * {
 * i:"", //event ID . font-end generate uuid
 * d:"", //Data Connect to who
 * c:{}, //Chain struct
 * r:"" // redirect address . null will not reqirect.
 * }
 * 
 * //Sign message
 * {
 * i:"", //event ID . font-end generate uuid
 * d:"", //Data Sign message . Base58encode . 
 * c:"", // Chain struct
 * r:""// redirect address
 * }
 * 
 * //Sign and send transaction
 * {
 * i:"", //event ID . font-end generate uuid
 * d:"", //Data transactions
 * c:{}, //Chain struct
 * r:"" // redirect address . null will not reqirect.
 * }
 */

 ```