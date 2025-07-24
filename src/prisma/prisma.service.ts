import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type PrismaEvent = 'beforeExit' | 'query' | 'info' | 'warn' | 'error';  

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

   enableShutdownHooks(app: INestApplication) {
    (this.$on as (event: PrismaEvent, callback: (...args: any[]) => any) => void)(
      'beforeExit',
      async () => {
        await app.close();
      },
    );
  }
}
