import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import type { BooksService } from './books.service';
import { SearchBooksDto } from './dto/search-books.dto';
import { BookSearchResultDto } from './dto/book-response.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({ summary: 'Search for books by title or author' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of books matching the search query',
    type: BookSearchResultDto,
  })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Search query to find books by title or author',
    example: 'harry potter',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results per page',
    example: 10,
  })
  async searchBooks(
    @Query() searchDto: SearchBooksDto,
  ): Promise<BookSearchResultDto> {
    return this.booksService.searchBooks(searchDto);
  }
}
