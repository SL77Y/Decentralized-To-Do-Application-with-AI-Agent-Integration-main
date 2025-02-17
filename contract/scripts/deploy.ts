import { ethers } from "hardhat";

async function main() {
  console.log("Starting todochain contract deployment....");

  const todoListFactor = await ethers.getContractFactory("TodoList");
  const todoList = await todoListFactor.deploy();

  await todoList.waitForDeployment();

  const deployedAddress = await todoList.getAddress();

  console.log(`TodoList deployed to:${deployedAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
