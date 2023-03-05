require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');
const { ARB_GOERLI_API_URL, ARB_PRIVATE_KEY, ARB_ETHERSCAN_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "arbGoerli",
  networks: {
    hardhat: {},
    arbGoerli: {
      url: ARB_GOERLI_API_URL,
      accounts: [`0x${ARB_PRIVATE_KEY}`],
    },
    
  },
  etherscan: {
    apiKey: {
      goerli: ARB_ETHERSCAN_API_KEY
    },
  }
};