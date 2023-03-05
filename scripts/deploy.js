const { ethers, upgrades } = require("hardhat");

async function main() {
  const Blockfiles = await ethers.getContractFactory("Blockfiles");
  const c = await upgrades.deployProxy(Blockfiles);
  await c.deployed();
  console.log("Blockfiles deployed to:", c.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
