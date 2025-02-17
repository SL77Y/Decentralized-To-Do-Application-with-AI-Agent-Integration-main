# TaskChain Frontend

A React-based frontend for decentralized task management with blockchain integration and AI-powered task analysis.

## Features

- MetaMask wallet integration for Web3 functionality
- Blockchain task verification and management
- AI-powered task prioritization and reminders
- Responsive UI using Tailwind CSS
- Real-time task status updates

## Prerequisites

- Node.js v16 or later
- MetaMask browser extension
- Backend server running
- Smart contract deployed on Sepolia testnet

## Installation & Setup

1. Clone the repository

```bash
git clone <repository-url>
cd todolist-frontend
```

2. Install dependencies

```bash
npm install
```

3. Create .env file

```bash
VITE_BACKEND_URL=http://localhost:3000
VITE_CONTRACT_ADDRESS=your-contract-address
```

4. Start developement server

```bash
npm run dev
```

## Project Structure

```bash
src/
├── components/
│   ├── common/          # Reusable components like Button, Input
│   ├── tasks/           # Task-related components
│   └── layout/          # Layout components like Header
├── context/             # React context for Wallet and Auth
├── hooks/               # Custom hooks for wallet and tasks
├── services/           # API and blockchain services
└── types/              # TypeScript interfaces
```

## Core Components

1. Wallet Integration

-- Connect with MetaMask
-- Transaction handling
-- Network validation

2. Task Management

-- Create and manage tasks
-- Blockchain verification
-- Priority and due date handling

3. AI Features

-- Task prioritization
-- Smart reminders
-- Productivity tips
