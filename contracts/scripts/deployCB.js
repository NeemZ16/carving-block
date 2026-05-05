const hre = require("hardhat");

async function main() {
  const CarvingBlock = await hre.ethers.getContractFactory("CarvingBlock");
  const yodaAddress = "";
  
  const contract = await CarvingBlock.deploy(yodaAddress);

  await contract.waitForDeployment();

  console.log("CarvingBlock deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});