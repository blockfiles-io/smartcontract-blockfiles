require("dotenv").config();
const { ethers, upgrades, network } = require("hardhat");
const { ARB_GOERLI_CONTRACT_ADDRESS } = process.env;

var contractAddress = "";

if (network.name == "arbGoerli") {
    contractAddress = ARB_GOERLI_CONTRACT_ADDRESS;
}

async function main() {
    const Blockfiles = await ethers.getContractFactory("Blockfiles");
    const c = await upgrades.upgradeProxy(contractAddress, Blockfiles);
    console.log("Blockfiles upgraded");
}

main();