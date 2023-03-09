
var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')

var myEnv = dotenv.config()
dotenvExpand.expand(myEnv)
const { network } = require("hardhat");
const { 
    ETH_PRIVATE_KEY,
    ETH_PUBLIC_KEY,
    ETH_GOERLI_CONTRACT_ADDRESS,
    ETH_GOERLI_CONTRACT_FILES_ADDRESS,
    ETH_GOERLI_API_URL,
    OPT_GOERLI_API_URL,
    OPT_PRIVATE_KEY,
    OPT_GOERLI_CONTRACT_ADDRESS,
    OPT_PUBLIC_KEY,
    OPT_GOERLI_CONTRACT_FILES_ADDRESS,
    SPH_CONTRACT_ADDRESS,
    SPH_API_URL,
    SPH_PUBLIC_KEY,
    SPH_PRIVATE_KEY,
    ARB_PRIVATE_KEY, 
    SPH_CONTRACT_FILES_ADDRESS,
    ARB_GOERLI_CONTRACT_ADDRESS,
    ARB_GOERLI_CONTRACT_FILES_ADDRESS,
    ARB_GOERLI_API_URL, 
    MAT_MUMBAI_CONTRACT_ADDRESS,
    MAT_MUMBAI_API_URL,
    MAT_PUBLIC_KEY,
    MAT_PRIVATE_KEY,
    MAT_API_URL,
    MAT_CONTRACT_ADDRESS,
    MAT_MUMBAI_CONTRACT_FILES_ADDRESS,
    ARB_ETHERSCAN_API_KEY } = process.env;

var contractAddress = "";
var apiUrl = "";
var publicKey = "";
var privateKey = "";
var blockfilesContractAddress= "";
var freeFilesFee = 0.005;

if (network.name == "arbGoerli") {
    contractAddress = ARB_GOERLI_CONTRACT_ADDRESS;
    apiUrl = ARB_GOERLI_API_URL;
    publicKey = ARB_PUBLIC_KEY;
    privateKey = ARB_PRIVATE_KEY;
    blockfilesContractAddress = ARB_GOERLI_CONTRACT_FILES_ADDRESS;
}
else if (network.name == "goerli") {
    contractAddress = ETH_GOERLI_CONTRACT_ADDRESS;
    apiUrl = ETH_GOERLI_API_URL;
    publicKey = ETH_PUBLIC_KEY;
    privateKey = ETH_PRIVATE_KEY;
    blockfilesContractAddress = ETH_GOERLI_CONTRACT_FILES_ADDRESS;
}
else if (network.name == "optGoerli") {
    contractAddress = OPT_GOERLI_CONTRACT_ADDRESS;
    apiUrl = OPT_GOERLI_API_URL;
    publicKey = OPT_PUBLIC_KEY;
    privateKey = OPT_PRIVATE_KEY;
    blockfilesContractAddress = OPT_GOERLI_CONTRACT_FILES_ADDRESS;
}
else if (network.name == "sphinx") {
    contractAddress = SPH_CONTRACT_ADDRESS;
    apiUrl = SPH_API_URL;
    publicKey = SPH_PUBLIC_KEY;
    privateKey = SPH_PRIVATE_KEY;
    blockfilesContractAddress = SPH_CONTRACT_FILES_ADDRESS;
}
else if (network.name == "mumbai") {
    contractAddress = MAT_MUMBAI_CONTRACT_ADDRESS;
    apiUrl = MAT_MUMBAI_API_URL;
    publicKey = MAT_PUBLIC_KEY;
    privateKey = MAT_PRIVATE_KEY;
    blockfilesContractAddress = MAT_MUMBAI_CONTRACT_FILES_ADDRESS;
}
else if (network.name == "polygon") {
    contractAddress = MAT_CONTRACT_ADDRESS;
    apiUrl = MAT_API_URL;
    publicKey = MAT_PUBLIC_KEY;
    privateKey = MAT_PRIVATE_KEY;
    freeFilesFee = 7;
}

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(apiUrl);

const contract = require("../artifacts/contracts/Blockfiles.sol/Blockfiles.json");
const nftContract = new web3.eth.Contract(contract.abi, contractAddress, {
    "from": publicKey
});

async function setFreeFilesFee(price) {
    
    const nonce = await web3.eth.getTransactionCount(publicKey, "latest") //get latest nonce

    var weiAmount = web3.utils.toWei(''+price,"ether");
  //the transaction
  const tx = {
    from: publicKey,
    to: contractAddress,
    nonce: nonce,
    gas: 6885000,
    data: nftContract.methods.setFreeFilesFee(weiAmount).encodeABI(),
  }

  const signPromise = web3.eth.accounts.signTransaction(tx, privateKey)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log(" Promise failed:", err)
    })   
}

setFreeFilesFee(freeFilesFee);