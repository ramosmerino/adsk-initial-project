import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { OpenLibraryService } from '../open-library/open-library.service';

@Module({
  imports: [ConfigModule, CacheModule.register()],
  controllers: [BooksController],
  providers: [BooksService, OpenLibraryService],
  exports: [BooksService],
})
export class BooksModule {}
