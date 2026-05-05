const hre = require("hardhat");

async function main() {
  // 1. deploy Yoda
  const Yoda = await hre.ethers.getContractFactory("ERC20Token");
  const yoda = await Yoda.deploy();
  await yoda.waitForDeployment();
  const yodaAddress = await yoda.getAddress();

  console.log("Yoda:", yodaAddress);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});