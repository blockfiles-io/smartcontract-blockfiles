
var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')

var myEnv = dotenv.config()
dotenvExpand.expand(myEnv)
const { network } = require("hardhat");
const ARB_GOERLI_API_URL = process.env.ARB_GOERLI_API_URL;
const ARB_PUBLIC_KEY = process.env.ARB_PUBLIC_KEY;
const ARB_PRIVATE_KEY = process.env.ARB_PRIVATE_KEY;
const { ARB_GOERLI_CONTRACT_ADDRESS } = process.env;

var contractAddress = "";
var apiUrl = "";
var publicKey = "";
var privateKey = "";

if (network.name == "arbGoerli") {
    contractAddress = ARB_GOERLI_CONTRACT_ADDRESS;
    apiUrl = ARB_GOERLI_API_URL;
    publicKey = ARB_PUBLIC_KEY;
    privateKey = ARB_PRIVATE_KEY;
}
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(apiUrl);

const contract = require("../artifacts/contracts/Blockfiles.sol/Blockfiles.json");
const nftContract = new web3.eth.Contract(contract.abi, contractAddress, {
    "from": publicKey
});

async function withdraw() {
    
    const nonce = await web3.eth.getTransactionCount(publicKey, "latest") //get latest nonce

  //the transaction
  const tx = {
    from: publicKey,
    to: contractAddress,
    nonce: nonce,
    gas: 6885000,
    data: nftContract.methods.withdraw().encodeABI(),
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

withdraw();