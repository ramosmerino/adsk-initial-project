import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { OpenLibraryService } from './open-library.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register(),
    HttpModule.register({
      timeout: 3000,
      maxRedirects: 3,
    }),
  ],
  providers: [OpenLibraryService],
  exports: [OpenLibraryService],
})
export class OpenLibraryModule {}
