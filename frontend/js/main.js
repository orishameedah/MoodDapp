// Contract details
const MoodContractAddress = "0xcBb47bae8Dd3f1f85b5bd3A189e6DfD1331fDE8f";
const MoodContractABI = [
    {
        "inputs": [],
        "name": "getMood",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_mood",
                "type": "string"
            }
        ],
        "name": "setMood",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Global variables
let web3;
let moodContract;
let userAccount;

// DOM Elements
const connectWalletBtn = document.getElementById('connect-wallet');
const getMoodBtn = document.getElementById('get-mood-btn');
const setMoodBtn = document.getElementById('set-mood-btn');
const connectionStatus = document.getElementById('connection-status');
const moodInput = document.getElementById('mood');
const showMood = document.getElementById('showMood');

// Initialization
// This ensures the code runs only after the DOM (HTML structure) is fully loaded.
document.addEventListener('DOMContentLoaded', function () {
    // Toggle connect/disconnect
    //Adds a click event listener to the "Connect Wallet" button:
    // If the wallet is already connected (userAccount is not null), it calls disconnectWallet.
    // Otherwise, it calls connectWallet for the user to connect the wallet
    connectWalletBtn.addEventListener('click', () => {
        if (userAccount) {
            disconnectWallet();
        } else {
            connectWallet();
        }
    });
    //Adds click event listeners to the "Get Mood" and "Set Mood" buttons:
    // getMood: Retrieves the mood from the blockchain.
    // setMood: Sets a new mood on the blockchain.
    getMoodBtn.addEventListener('click', getMood);
    setMoodBtn.addEventListener('click', setMood);
});

// Connect wallet function
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {  //Checks if the browser has MetaMask or another Ethereum provider installed (window.ethereum  
        try {
            connectionStatus.textContent = 'Connecting...'; // Updates the connection status to indicate that the wallet is being connected.
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts' //Requests the user to connect their Ethereum wallet and returns the list of accounts.
            });

            if (accounts.length > 0) { //If accounts are available, it sets the first account as the connected account.
                userAccount = accounts[0];
                //Updates the UI to show the connected account (shortened for readability) and changes the text color to green.
                connectionStatus.textContent = `Connected: ${userAccount.substring(0, 6)}...${userAccount.substring(userAccount.length - 4)}`;
                connectionStatus.style.color = 'green';

                //Initializes the Web3.js instance and the smart contract instance.
                web3 = new Web3(window.ethereum);
                moodContract = new web3.eth.Contract(MoodContractABI, MoodContractAddress);

                const chainId = await web3.eth.getChainId();
                if (chainId !== 11155111) {
                    connectionStatus.textContent += ' (Wrong Network - Please switch to Sepolia)';
                    connectionStatus.style.color = 'orange';
                }

                //Updates the button text to "Disconnect Wallet" if connected, or shows an error if no accounts are available.
                connectWalletBtn.textContent = 'Disconnect Wallet';
            } else {
                connectionStatus.textContent = 'No accounts available';
                connectionStatus.style.color = 'red';
            }
        } catch (error) {
            console.error('Connection error:', error);
            connectionStatus.textContent = `Error: ${error.message || 'Connection failed'}`;
            connectionStatus.style.color = 'red';
        }
    } else {
        connectionStatus.textContent = 'MetaMask not installed';
        connectionStatus.style.color = 'red';
    }
}

// Disconnect wallet function
function disconnectWallet() {
    //Resets the global variables to null, effectively disconnecting the wallet.
    userAccount = null;
    web3 = null;
    moodContract = null;

    //Updates the UI to indicate that the wallet is disconnected.
    connectionStatus.textContent = 'Wallet Disconnected';
    connectionStatus.style.color = 'gray';

    //Changes the button text back to "Connect Wallet."
    connectWalletBtn.textContent = 'Connect Wallet';
}

// Get mood function
async function getMood() {
    //Checks if the wallet is connected and the contract is initialized. If not, it shows an alert.
    if (!web3 || !moodContract) {
        alert('Please connect your wallet first');
        return;
    }

    //Calls the getMood method of the contract to retrieve the mood and updates the UI with the result or an error message.
    try {
        const mood = await moodContract.methods.getMood().call();
        showMood.innerText = mood ? `Current Mood: ${mood}` : 'No mood set yet';
    } catch (error) {
        console.error('Error getting mood:', error);
        showMood.innerText = 'Error getting mood';
    }
}

// Set mood function
async function setMood() {
    //Checks if the wallet is connected, the contract is initialized, and the user account is available.
    if (!web3 || !moodContract || !userAccount) {
        alert('Please connect your wallet first');
        return;
    }

    //Retrieves the mood from the input field and validates it (ensures it’s not empty).
    const mood = moodInput.value.trim();
    if (!mood) {
        alert('Please enter a mood');
        return;
    }

    try {
        //Disables the "Set Mood" button and updates its text to indicate processing.
        setMoodBtn.disabled = true;
        setMoodBtn.textContent = 'Processing...';

        //Calls the setMood method of the contract to update the mood, sending a transaction from the connected account.
        await moodContract.methods.setMood(mood).send({
            from: userAccount
        });

        //Updates the UI with the new mood or an error message, and re-enables the button.
        showMood.innerText = `Mood set to: ${mood}`;
        moodInput.value = '';
    } catch (error) {
        console.error('Error setting mood:', error);
        showMood.innerText = 'Error setting mood';
    } finally {
        setMoodBtn.disabled = false;
        setMoodBtn.textContent = 'Set Mood';
    }
}
