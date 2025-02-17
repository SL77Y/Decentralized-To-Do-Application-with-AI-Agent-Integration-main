import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_CONFIG } from '../config/contract.config';
import { BlockchainTask } from '../../task/type';

@Injectable()
export class ContractService implements OnModuleInit {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private readonly logger = new Logger(ContractService.name);

  async onModuleInit() {
    try {
      this.provider = new ethers.JsonRpcProvider(CONTRACT_CONFIG.rpcUrl);
      this.contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_ABI,
        this.provider,
      );
      this.logger.log('Contract service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize contract service', error);
      throw error;
    }
  }

  async getTask(taskHash: string): Promise<BlockchainTask> {
    try {
      const task = await this.contract.getTask(taskHash);
      return {
        id: taskHash,
        owner: task.owner,
        isCompleted: task.isCompleted,
        isDeleted: task.isDeleted,
        createdAt: Number(task.createdAt),
        completedAt: Number(task.completedAt),
      };
    } catch (error) {
      this.logger.error(`Failed to get task ${taskHash}`, error);
      throw error;
    }
  }

  async getFilteredTasks(
    userAddress: string,
    includeCompleted = false,
    includeDeleted = false,
  ): Promise<BlockchainTask[]> {
    try {
      const taskHashes = await this.contract.getFilteredTasks(
        userAddress,
        includeCompleted,
        includeDeleted,
      );

      const tasks = await Promise.all(
        taskHashes.map((hash) => this.getTask(hash)),
      );

      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get filtered tasks for ${userAddress}`,
        error,
      );
      throw error;
    }
  }

  getContractConfig() {
    return {
      address: CONTRACT_CONFIG.address,
      abi: CONTRACT_ABI,
    };
  }
}
