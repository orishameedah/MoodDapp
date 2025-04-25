# Mood Diary dApp
A decentralized application (dApp) that allows users to set and retrieve their mood on the Ethereum blockchain.

## Features

- **Set Mood**: Save your current mood to the blockchain.
- **Get Mood**: Retrieve your saved mood from the blockchain.
- **Wallet Integration**: Connect your Ethereum wallet using MetaMask.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Blockchain**: Ethereum
- **Smart Contract**: Solidity
- **Web3.js**: For blockchain interaction

## How It Works

1. **Smart Contract**:  
   The `MoodDiary` smart contract is deployed on the Ethereum blockchain. It has two functions:
   - `setMood(string memory _mood)`: Saves the mood to the blockchain.
   - `getMood() public view returns (string memory)`: Retrieves the saved mood.

2. **Frontend**:  
   The frontend allows users to:
   - Connect their wallet.
   - Input and save their mood.
   - Retrieve their mood from the blockchain.

3. **Wallet Integration**:  
   MetaMask is used to connect to the Ethereum blockchain and interact with the smart contract.

## Prerequisites
- MetaMask installed in your browser.
- Access to the Ethereum Sepolia test network.

# How to run the dapp
# Deploy the smart contract:
- Use a tool like Remix IDE or Hardhat to deploy Mood.sol to the Sepolia test network.
- Copy the deployed contract address and the deloyed contract ABI and update it in frontend/js/main.js under MoodContractAddress and MoodContractABI
# Run the frontend:
- Open index.html in your browser.

# Usage
- Open the dApp in your browser.
- Connect your wallet using the "Connect Wallet" button.
- Enter your mood in the input field and click "Set Mood" to save it.
- Click "Get Mood" to retrieve your saved mood.