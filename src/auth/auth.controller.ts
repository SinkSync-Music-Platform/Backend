import { Controller, Get, Redirect, Query, Res, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service'
import { Response } from 'express';
import axios from 'axios';


@Controller('auth/spotify')
export class AuthController {
   constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Get('login')
  @Redirect()
  redirectToSpotify() {
    // .env에서 환경변수 불러오기
    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    if (!clientId) throw new Error('Missing Spotify client ID');
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;
    const scope = process.env.SPOTIFY_SCOPES!;

    // Spotify 로그인 요청에 필요한 쿼리 파라미터 생성
    const query = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: scope,
    });

    // query.toString()은 위 key-value들을 아래처럼 문자열로 바꿔줌:
    // client_id=abc123&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&scope=user-read-email...
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${query.toString()}`;

    return { url: spotifyAuthUrl }; // NestJS가 여길 보고 redirect시킴
  }

@Get('callback')
async handleCallback(@Query('code') code: string, @Res() res: Response){
  if(!code) {
    return res.status(400).send('Authorization code not found');
  }
  const tokenResponse = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type:  'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  const { access_token, refresh_token } = tokenResponse.data;

  const userProfile = await axios.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const {
    id: spotifyId,
    display_name: nickname,
    email,
  } = userProfile.data;

  // 3. 사용자 저장
  const user = await this.userService.findOrCreateUser(
    'spotify',
    spotifyId,
    nickname,
    email,
    access_token,
    refresh_token,
  );

  // 4. JWT 발급
  const jwt = this.authService.generateJwt(user);

  // 5. 프런트로 리디렉션
  return res.redirect(`http://localhost:5173/oauth-success?token=${jwt}`);
  }
}
