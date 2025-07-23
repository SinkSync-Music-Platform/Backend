import { Controller, Get, Redirect, Query, Res, Injectable } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';


@Controller('auth/spotify')
export class AuthController {
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
    return res.status(400).send('Authorixation code not found');
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

  // 2. 유저 정보 요청
    const userProfile = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = userProfile.data;

    // 3. DB 저장 (추후 Prisma 연동할 부분)
    // 4. JWT 발급 (추후 구현)
    // 5. 프런트로 redirect
    return res.redirect(`http://localhost:5173/oauth-success?name=${user.display_name}`);
  }
}
