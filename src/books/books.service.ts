import { Injectable } from '@nestjs/common';
import { OpenLibraryService } from '../open-library/open-library.service';
import type { SearchBooksDto } from './dto/search-books.dto';
import type { BookSearchResultDto } from './dto/book-response.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(private readonly openLibraryService: OpenLibraryService) {}

  async searchBooks(searchDto: SearchBooksDto): Promise<BookSearchResultDto> {
    try {
      return await this.openLibraryService.searchBooks(searchDto);
    } catch (error) {
      this.logger.error('Error searching books:', error);
      throw new Error('Failed to search for books. Please try again later.');
    }
  }
}
