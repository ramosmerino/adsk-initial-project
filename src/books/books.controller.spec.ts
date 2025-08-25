import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { SearchBooksDto } from './dto/search-books.dto';
import { BookSearchResultDto } from './dto/book-response.dto';

describe('BooksController', () => {
  let controller: BooksController;
  let booksService: BooksService;

  const mockBooksService = {
    searchBooks: jest.fn(),
  };

  const mockBookResult: BookSearchResultDto = {
    items: [
      {
        key: '/works/OL82565W',
        title: "Harry Potter and the Philosopher's Stone",
        authors: [{ name: 'J.K. Rowling', key: '/authors/OL23919A' }],
        first_publish_year: 1997,
        cover_image: 'https://covers.openlibrary.org/b/id/8406789-M.jpg',
        url: 'https://openlibrary.org/works/OL82565W',
      },
    ],
    total: 1,
    page: 1,
    limit: 10,
    _links: {
      self: 'http://localhost:3000/api/books?query=harry+potter&page=1&limit=10',
      last: 'http://localhost:3000/api/books?query=harry+potter&page=1&limit=10',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    booksService = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(booksService).toBeDefined();
  });

  describe('GET /books', () => {
    const searchDto: SearchBooksDto = {
      query: 'harry potter',
      page: 1,
      limit: 10,
    };

    it('should return book search results', async () => {
      jest.spyOn(booksService, 'searchBooks').mockResolvedValue(mockBookResult);

      const result = await controller.searchBooks(searchDto);

      expect(result).toEqual(mockBookResult);
      expect(booksService.searchBooks).toHaveBeenCalledWith(searchDto);
    });

    it('should call service with default pagination values if not provided', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { page, limit, ...rest } = searchDto;
      const expectedDto = { ...rest };
      jest.spyOn(booksService, 'searchBooks').mockResolvedValue(mockBookResult);

      await controller.searchBooks({ ...rest } as SearchBooksDto);

      expect(booksService.searchBooks).toHaveBeenCalledWith(expectedDto);
    });

    it('should throw BadRequestException when query parameter is missing', async () => {
      const invalidDto = { page: 1, limit: 10 } as unknown as SearchBooksDto;
      jest
        .spyOn(booksService, 'searchBooks')
        .mockRejectedValue(
          new BadRequestException('query should not be empty'),
        );

      await expect(controller.searchBooks(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle service errors properly', async () => {
      const error = new Error('Service error');
      jest.spyOn(booksService, 'searchBooks').mockRejectedValue(error);

      await expect(controller.searchBooks(searchDto)).rejects.toThrow(error);
    });
  });
});
