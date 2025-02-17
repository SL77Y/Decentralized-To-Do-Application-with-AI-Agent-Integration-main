import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to database successfully', async () => {
      // Mock the $connect method
      jest.spyOn(service, '$connect').mockResolvedValue(undefined);
      // Mock console.log
      const consoleSpy = jest.spyOn(console, 'log');

      await service.onModuleInit();

      expect(service.$connect).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Database connection successful');
    });

    it('should handle connection error', async () => {
      // Mock the $connect method to throw error
      jest
        .spyOn(service, '$connect')
        .mockRejectedValue(new Error('Connection failed'));
      // Mock console.error
      const consoleSpy = jest.spyOn(console, 'error');

      await service.onModuleInit();

      expect(service.$connect).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Database connection failed:',
        new Error('Connection failed'),
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
