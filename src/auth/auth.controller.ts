import { Controller, Get, Redirect } from '@nestjs/common';

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
}