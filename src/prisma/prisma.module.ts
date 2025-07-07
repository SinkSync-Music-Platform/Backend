import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // 전역 등록!
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
