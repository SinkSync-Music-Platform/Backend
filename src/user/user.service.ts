
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateUser(
  platform: string,
  platformUserId: string,
  nickname: string,
  email: string,
  accessToken: string,
  refreshToken: string,
) {
  const existingUser = await this.prisma.user.findUnique({
    where: {
      streamingPlatform_platformUserId: {
        streamingPlatform: platform,
        platformUserId,
      },
    },
  });

  if (existingUser) {
    return this.prisma.user.update({
      where: {
        streamingPlatform_platformUserId: {
          streamingPlatform: platform,
          platformUserId,
        },
      },
      data: {
        accessToken,
        refreshToken,
      },
    });
  }

  return this.prisma.user.create({
    data: {
      streamingPlatform: platform,
      platformUserId,
      nickname,
      email,
      accessToken,
      refreshToken,
    },
  });
}
}
