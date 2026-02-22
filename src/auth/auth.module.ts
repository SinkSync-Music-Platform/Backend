import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '7d' },
}), UserModule,
  ],
  controllers: [AuthService, AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}


