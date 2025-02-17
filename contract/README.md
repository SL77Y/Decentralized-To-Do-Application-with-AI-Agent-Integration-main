# TodoChain Smart Contract

A decentralized todo list smart contract that allows users to manage their tasks on blockchain.

## Tech Stack

- Solidity ^0.8.19
- Hardhat
- TypeScript
- Ethers.js
- OpenZeppelin Contracts

## Features

- Task creation with unique hash
- Task completion verification
- Task status tracking
- Event emissions for task operations
- Access control for task management
- Gas-optimized operations

## Prerequisites

- Node.js >= 14.x
- npm or yarn
- MetaMask wallet

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the root directory:

```env
SEPOLIA_RPC_URL=your_sepolia_endpoint
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Smart Contract Details

### TodoList Contract

The main contract that handles task management:

- Task Creation: Users can create tasks with unique identifiers
- Task Completion: Tasks can be marked as completed with blockchain verification
- Task Deletion: Soft delete functionality for tasks
- Event Tracking: Events emitted for all major operations

### Key Functions

```solidity
function createTask(bytes32 _taskId) external
function completeTask(bytes32 _taskId) external
function deleteTask(bytes32 _taskId) external
function getFilteredTasks(...) external view returns (bytes32[] memory)
```

## Testing

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/TodoList.test.ts
```

## Deployment

```bash
# Deploy to local hardhat network
npx hardhat run scripts/deploy.ts

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.ts --network sepolia
```

## Contract Verification

After deployment, verify your contract on Sepolia Etherscan:

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## Security Measures

- ReentrancyGuard implementation
- Access control for task operations
- Input validation
- Gas optimization

## License

MIT

## Contact

[Your Contact Information]
