import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module'; // ✅ 추가
import { CommentsModule } from './comments/comments.module';
import { LibraryModule } from './library/library.module';
import { RecommendationModule } from './recommendation/recommendation.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, CommentsModule, LibraryModule, RecommendationModule], // ✅ 여기에도 추가
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
