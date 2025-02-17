import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

describe('AppService', () => {
  let service: AppService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: DatabaseService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('serverHealthCheck', () => {
    it('should resolve successfully', async () => {
      await expect(service.serverHealthCheck()).resolves.not.toThrow();
    });
  });

  describe('databaseHealthCheck', () => {
    it('should call database query successfully', async () => {
      await service.databaseHealthCheck();
      expect(databaseService.$queryRaw).toHaveBeenCalled();
    });

    it('should throw error if database query fails', async () => {
      jest
        .spyOn(databaseService, '$queryRaw')
        .mockRejectedValueOnce(new Error('DB Error'));
      await expect(service.databaseHealthCheck()).rejects.toThrow('DB Error');
    });
  });

  describe('healthCheck', () => {
    it('should return true when all checks pass', async () => {
      const result = await service.healthCheck();
      expect(result).toBe(true);
    });

    it('should throw error if any check fails', async () => {
      jest
        .spyOn(databaseService, '$queryRaw')
        .mockRejectedValueOnce(new Error('DB Error'));
      await expect(service.healthCheck()).rejects.toThrow();
    });
  });
});
