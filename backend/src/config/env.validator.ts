import { plainToClass, Transform } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

export enum EnvironmentType {
  LOCAL = 'local',
  STAGE = 'stage',
  RELEASE = 'release',
  PRODUCTION = 'production',
}

export class EnvironmentDTO {
  @Transform(({ value }) => Number(value)) // Ensure PORT is converted to a number
  @IsNumber({}, { message: 'PORT must be a number' })
  PORT: number;

  @IsString({ message: 'DATABASE_URL must be a string' })
  DATABASE_URL: string;

  @IsString({ message: 'CONTRACT_ADDRESS must be a string' })
  CONTRACT_ADDRESS: string;

  @IsString({ message: 'SEPOLIA_RPC_URL must be a string' })
  SEPOLIA_RPC_URL: string;

  @IsString({ message: 'JWT_SECRET must be a string' })
  JWT_SECRET: string;

  @IsString({ message: 'HUGGINGFACE_API_KEY must be a string' })
  HUGGINGFACE_API_KEY: string;

  @IsString({ message: 'FRONTEND_URL must be a string' })
  FRONTEND_URL: string;
}

/**
 * Validate the configuration against the EnvironmentVariables schema
 * @param configuration The configuration to validate
 * @returns The validated configuration
 * @throws Error if the configuration is invalid
 */
export function validateEnvironment(configuration: Record<string, unknown>) {
  const finalConfig = plainToClass(EnvironmentDTO, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(
      `Configuration validation error: ${errors.map((e) => e.toString()).join(', ')}`
    );
  }

  return finalConfig;
}
