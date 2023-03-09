var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')

var myEnv = dotenv.config()
dotenvExpand.expand(myEnv)
const { ethers, upgrades, network } = require("hardhat");
const { 
    ARB_GOERLI_CONTRACT_ADDRESS,
    OPT_GOERLI_CONTRACT_ADDRESS,
    SPH_CONTRACT_ADDRESS,
    MAT_CONTRACT_ADDRESS,
    ETH_GOERLI_CONTRACT_ADDRESS
} = process.env;

var contractAddress = "";

if (network.name == "arbGoerli") {
    contractAddress = ARB_GOERLI_CONTRACT_ADDRESS;
}
else if (network.name == "optGoerli") {
    contractAddress = OPT_GOERLI_CONTRACT_ADDRESS;
}
else if (network.name == "sphinx") {
    contractAddress = SPH_CONTRACT_ADDRESS;
}
else if (network.name == "goerli") {
    contractAddress = ETH_GOERLI_CONTRACT_ADDRESS;
}
else if (network.name == "polygon") {
    contractAddress = MAT_CONTRACT_ADDRESS;
}

async function main() {
    const Blockfiles = await ethers.getContractFactory("Blockfiles");
    const c = await upgrades.upgradeProxy(contractAddress, Blockfiles);
    console.log("Blockfiles upgraded");
}

main();