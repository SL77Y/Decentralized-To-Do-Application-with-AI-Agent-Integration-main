import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import { Logger } from '@nestjs/common';
import { ContractService } from './contract.service';
import { CONTRACT_ABI, CONTRACT_CONFIG } from '../config/contract.config';

jest.mock('ethers', () => {
  const original = jest.requireActual('ethers');
  return {
    ...original,
    JsonRpcProvider: jest.fn().mockImplementation(() => ({
      getNetwork: jest.fn().mockResolvedValue({ name: 'testnet' }),
    })),
    Contract: jest.fn().mockImplementation(() => ({
      getTask: jest.fn(),
      getFilteredTasks: jest.fn(),
    })),
  };
});

describe('ContractService', () => {
  let service: ContractService;
  let contractMock: jest.Mocked<ethers.Contract>;
  let providerMock: jest.Mocked<ethers.JsonRpcProvider>;
  const loggerSpy = jest.spyOn(Logger.prototype, 'error');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractService],
    }).compile();

    service = module.get<ContractService>(ContractService);

    // Mock instances
    providerMock =
      new ethers.JsonRpcProvider() as jest.Mocked<ethers.JsonRpcProvider>;
    contractMock = new ethers.Contract(
      CONTRACT_CONFIG.address,
      CONTRACT_ABI,
      providerMock,
    ) as jest.Mocked<ethers.Contract>;

    // Assign mocked contract to the service
    (service as any).provider = providerMock;
    (service as any).contract = contractMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should initialize the provider and contract successfully', async () => {
      await service.onModuleInit();
      expect(service['provider']).toBeInstanceOf(ethers.JsonRpcProvider);
      expect(service['contract']).toBeInstanceOf(ethers.Contract);
    });

    it('should log an error if initialization fails', async () => {
      (ethers.JsonRpcProvider as jest.Mock).mockImplementation(() => {
        throw new Error('Provider initialization error');
      });

      await expect(service.onModuleInit()).rejects.toThrow(
        'Provider initialization error',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Failed to initialize contract service',
        expect.any(Error),
      );
    });
  });

  describe('getTask', () => {
    it('should return the task from the contract', async () => {
      const taskHash = '0x123';
      const mockTask = { title: 'Sample Task', completed: false };
      contractMock.getTask.mockResolvedValue(mockTask);

      const result = await service.getTask(taskHash);
      expect(result).toEqual(mockTask);
      expect(contractMock.getTask).toHaveBeenCalledWith(taskHash);
    });

    it('should log an error and throw if task retrieval fails', async () => {
      const taskHash = '0x123';
      contractMock.getTask.mockRejectedValue(
        new Error('Contract method error'),
      );

      await expect(service.getTask(taskHash)).rejects.toThrow(
        'Contract method error',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        `Failed to get task ${taskHash}`,
        expect.any(Error),
      );
    });
  });

  describe('getFilteredTasks', () => {
    it('should return filtered tasks from the contract', async () => {
      const userAddress = '0xabc';
      const mockTasks = [
        { title: 'Task 1', completed: false },
        { title: 'Task 2', completed: true },
      ];
      contractMock.getFilteredTasks.mockResolvedValue(mockTasks);

      const result = await service.getFilteredTasks(userAddress, true, false);
      expect(result).toEqual(mockTasks);
      expect(contractMock.getFilteredTasks).toHaveBeenCalledWith(
        userAddress,
        true,
        false,
      );
    });

    it('should log an error and throw if filtered task retrieval fails', async () => {
      const userAddress = '0xabc';
      contractMock.getFilteredTasks.mockRejectedValue(
        new Error('Filtered tasks error'),
      );

      await expect(
        service.getFilteredTasks(userAddress, true, false),
      ).rejects.toThrow('Filtered tasks error');
      expect(loggerSpy).toHaveBeenCalledWith(
        `Failed to get filtered tasks for ${userAddress}`,
        expect.any(Error),
      );
    });
  });

  describe('getContractConfig', () => {
    it('should return the contract configuration', () => {
      const config = service.getContractConfig();
      expect(config).toEqual({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_ABI,
      });
    });
  });
});
