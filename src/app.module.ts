import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { OpenLibraryModule } from './open-library/open-library.module';
import config from './shared/config/env.config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: config.get('cache.ttl'),
      max: config.get('cache.max'),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: config.get('throttler.ttl'),
        limit: config.get('throttler.limit'),
      },
    ]),
    HttpModule.register({
      global: true,
      timeout: 3000,
      maxRedirects: 3,
    }),
    TerminusModule,
    BooksModule,
    OpenLibraryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
