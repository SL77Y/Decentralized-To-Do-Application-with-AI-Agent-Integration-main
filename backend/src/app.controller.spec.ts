import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            healthCheck: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should return success message when health check passes', async () => {
      jest.spyOn(service, 'healthCheck').mockResolvedValue(true);

      const result = await controller.healthCheck();

      expect(result).toEqual({
        message: 'Application is healthy.',
      });
      expect(service.healthCheck).toHaveBeenCalled();
    });

    it('should throw error when health check fails', async () => {
      jest
        .spyOn(service, 'healthCheck')
        .mockRejectedValue(new Error('Health check failed'));

      await expect(controller.healthCheck()).rejects.toThrow(
        'Health check failed',
      );
    });
  });
});
