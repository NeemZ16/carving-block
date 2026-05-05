 const hre = require("hardhat");

async function main() {
  // 1. deploy Yoda
  const Yoda = await hre.ethers.getContractFactory("ERC20Token");
  const yoda = await Yoda.deploy(1000, 2);
  await yoda.deployed();
  const yodaAddress = yoda.address;

  console.log("Yoda:", yodaAddress);

  // 2. deploy CarvingBlock with Yoda address
  const CarvingBlock = await hre.ethers.getContractFactory("CarvingBlock");
  const carving = await CarvingBlock.deploy(yodaAddress);
  await carving.deployed();
  const carvingAddress = carving.address;

  console.log("CB:", carvingAddress);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});