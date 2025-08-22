import { ApiProperty } from '@nestjs/swagger';

export class AuthorDto {
  @ApiProperty({ example: 'J.K. Rowling' })
  name: string;

  @ApiProperty({
    example: 'OL23919A',
    description: 'Open Library Author ID',
    required: false,
  })
  key?: string;
}

export class BookDto {
  @ApiProperty({ example: 'OL82565W' })
  key: string;

  @ApiProperty({ example: 'Harry Potter and the Philosopher\'s Stone' })
  title: string;

  @ApiProperty({
    type: [AuthorDto],
    example: [{ name: 'J.K. Rowling', key: 'OL23919A' }],
  })
  authors: AuthorDto[];

  @ApiProperty({
    example: '2001',
    description: 'First published year',
    required: false,
  })
  first_publish_year?: number;

  @ApiProperty({
    example: 'https://covers.openlibrary.org/b/id/8406789-M.jpg',
    required: false,
  })
  cover_image?: string;

  @ApiProperty({
    example: 'https://openlibrary.org/works/OL82565W',
    description: 'URL to the book on Open Library',
  })
  url: string;
}

export class BookSearchResultDto {
  @ApiProperty({
    type: [BookDto],
    description: 'List of books matching the search query',
  })
  items: BookDto[];

  @ApiProperty({ example: 42, description: 'Total number of results' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  limit: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'string',
    },
    example: {
      self: '/books?query=harry+potter&page=1&limit=10',
      next: '/books?query=harry+potter&page=2&limit=10',
      last: '/books?query=harry+potter&page=5&limit=10',
    },
    description: 'HATEOAS links for navigation',
  })
  _links: Record<string, string>;
}
