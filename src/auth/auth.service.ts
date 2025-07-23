
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async findOrCreateUser(userData: {
    streaming_platform: string;
    user_id: string;
    nickname: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  }) {
    // 1. 이미 존재하는 유저인지 확인 (복합 키로 조회)
    const existingUser = await this.prisma.user.findUnique({
      where: {
        streamingPlatform_platformUserId: {
          streamingPlatform: userData.streaming_platform,
          platformUserId: userData.user_id,
        }
      }
    });

    // 2. 이미 존재하면 토큰만 업데이트 후 반환
    if (existingUser) {
      return await this.prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
        }
      });
    }

    // 3. 없다면 새로 생성
    return await this.prisma.user.create({
      data: {
        streamingPlatform: userData.streaming_platform,
        platformUserId: userData.user_id,
        nickname: userData.nickname,
        email: userData.email,
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
      }
    });
  }

   generateJwt(user: User) {
    return this.jwtService.sign({
      sub: user.id,
      platform: user.streamingPlatform,
      nickname: user.nickname,
    });
  }
}

