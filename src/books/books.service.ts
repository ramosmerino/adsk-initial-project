import { Injectable } from '@nestjs/common';
import { OpenLibraryService } from '../open-library/open-library.service';
import type { SearchBooksDto } from './dto/search-books.dto';
import type { BookSearchResultDto } from './dto/book-response.dto';

@Injectable()
export class BooksService {
  constructor(private readonly openLibraryService: OpenLibraryService) {}

  async searchBooks(searchDto: SearchBooksDto): Promise<BookSearchResultDto> {
    try {
      return await this.openLibraryService.searchBooks(searchDto);
    } catch (error) {
      console.error('Error searching books:', error);
      throw new Error('Failed to search for books. Please try again later.');
    }
  }
}
