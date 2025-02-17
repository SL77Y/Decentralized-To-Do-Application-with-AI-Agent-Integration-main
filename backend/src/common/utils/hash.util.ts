import { ethers } from 'ethers';

/**
 * Generates a unique task hash using task title, user address, and timestamp
 * This hash is used to identify the task both on the blockchain and in the database
 *
 * @param title - Task title
 * @param userAddress - Ethereum address of the task creator
 * @param timestamp - Creation timestamp (should be from server)
 * @returns string - Keccak256 hash of the task
 */
export function generateTaskHash(
  title: string,
  userAddress: string,
  timestamp: number,
): string {
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedAddress = userAddress.toLowerCase();

  return ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ['string', 'address', 'uint256'],
      [normalizedTitle, normalizedAddress, timestamp],
    ),
  );
}
