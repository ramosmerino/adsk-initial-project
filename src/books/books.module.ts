import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenLibraryService } from '../open-library/open-library.service';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [ConfigModule],
  controllers: [BooksController],
  providers: [BooksService, OpenLibraryService],
  exports: [BooksService],
})
export class BooksModule {}
