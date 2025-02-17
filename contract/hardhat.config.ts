import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;
const privateKey = process.env.PRIVATE_KEY;
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: sepoliaRpcUrl || "",
      accounts: privateKey ? [privateKey] : [],
      chainId: 11155111,
    },
    hardhat: {
      chainId: 31337,
      allowBlocksWithSameTimestamp: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  etherscan: {
    apiKey: etherscanApiKey,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
};

export default config;
