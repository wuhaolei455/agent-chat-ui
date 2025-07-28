import { plainToClass, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number = 3001;

  @IsString()
  @IsOptional()
  DATABASE_URL: string = 'postgresql://user:pass@localhost:5432/agentchat';

  @IsString()
  @IsOptional()
  JWT_SECRET: string = 'your-super-secret-jwt-key-change-in-production';

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string = '7d';

  @IsString()
  @IsOptional()
  OPENAI_API_KEY: string = '';

  @IsString()
  @IsOptional()
  REDIS_URL: string = '';

  @IsString()
  @IsOptional()
  CORS_ORIGINS: string = 'http://localhost:3000,https://localhost:3000';

  @IsString()
  @IsOptional()
  FILE_UPLOAD_PATH: string = './uploads';

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  MAX_FILE_SIZE: number = 10 * 1024 * 1024; // 10MB

  @IsString()
  @IsOptional()
  SMTP_HOST: string = '';

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  SMTP_PORT: number = 587;

  @IsString()
  @IsOptional()
  SMTP_USER: string = '';

  @IsString()
  @IsOptional()
  SMTP_PASS: string = '';

  @IsString()
  @IsOptional()
  SENTRY_DSN: string = '';
}

export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`环境变量验证失败: ${errors.toString()}`);
  }

  return validatedConfig;
} 