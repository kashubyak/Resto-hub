import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config({ override: false });

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl)
      throw new Error('DATABASE_URL environment variable is not set');

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log:
        process.env.NODE_ENV === 'development'
          ? ['error', 'warn']
          : process.env.NODE_ENV === 'test'
          ? []
          : ['error'],
    });
  }

  async onModuleInit(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      const TEST_CONNECTION_MAX_RETRIES = 5;
      const TEST_CONNECTION_RETRY_DELAY = 500;

      for (let attempt = 1; attempt <= TEST_CONNECTION_MAX_RETRIES; attempt++) {
        try {
          await this.$connect();
          return;
        } catch (error) {
          if (attempt === TEST_CONNECTION_MAX_RETRIES) throw error;
          await new Promise(resolve => setTimeout(resolve, TEST_CONNECTION_RETRY_DELAY));
        }
      }
    } else await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
