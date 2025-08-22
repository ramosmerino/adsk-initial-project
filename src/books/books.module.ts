import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { OpenLibraryService } from '../open-library/open-library.service';

@Module({
  imports: [ConfigModule],
  controllers: [BooksController],
  providers: [BooksService, OpenLibraryService],
  exports: [BooksService],
})
export class BooksModule {}
