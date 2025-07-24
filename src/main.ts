import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS 허용 설정 (프런트 URL 넣기)
  app.enableCors({
    origin: '*', // (개발용)
    // origin: ['https://your-frontend-url.com'], // 정식 배포시, 정확한 프런트 URL만 허용
    credentials: true,
  });

  // ✅ Render가 제공하는 포트에서 실행
  await app.listen(process.env.PORT || 3000);
  // await app.listen(3000, '127.0.0.1');

}
bootstrap();

