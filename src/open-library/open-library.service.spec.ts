import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import type { BookSearchResultDto } from '../books/dto/book-response.dto';
import type { SearchBooksDto } from '../books/dto/search-books.dto';
import { OpenLibraryService } from './open-library.service';

describe('OpenLibraryService', () => {
  let service: OpenLibraryService;
  let httpService: jest.Mocked<HttpService>;
  let cacheManager: any;

  const mockSearchDto: SearchBooksDto = {
    query: 'test query',
    page: 1,
    limit: 10,
  };

  const mockApiResponse = {
    docs: [
      {
        key: '/works/OL1W',
        title: 'Test Book',
        author_name: ['Test Author'],
        author_key: ['/authors/TA1'],
        first_publish_year: 2023,
        cover_i: 12345,
      },
    ],
    numFound: 1,
    start: 0,
  };

  const mockBookResult: BookSearchResultDto = {
    items: [
      {
        key: '/works/OL1W',
        title: 'Test Book',
        authors: [{ name: 'Test Author', key: '/authors/TA1' }],
        first_publish_year: 2023,
        cover_image: 'https://covers.openlibrary.org/b/id/12345-M.jpg',
        url: 'https://openlibrary.org/works/OL1W',
      },
    ],
    total: 1,
    page: 1,
    limit: 10,
    _links: {
      self: 'http://localhost:3000/api/books?query=test%20query&page=1&limit=10',
      last: 'http://localhost:3000/api/books?query=test%20query&page=1&limit=10',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenLibraryService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OpenLibraryService>(OpenLibraryService);
    httpService = module.get<HttpService>(
      HttpService,
    ) as jest.Mocked<HttpService>;
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchBooks', () => {
    it('should return cached result if available', async () => {
      const cacheKey = `search:${mockSearchDto.query}:${mockSearchDto.page}:${mockSearchDto.limit}`;

      cacheManager.get.mockResolvedValueOnce(mockBookResult);

      const result = await service.searchBooks(mockSearchDto);

      expect(result).toEqual(mockBookResult);
      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(httpService.get).not.toHaveBeenCalled();
    });

    it('should fetch from API and cache the result when not in cache', async () => {
      cacheManager.get.mockResolvedValueOnce(undefined);
      httpService.get.mockReturnValue(of({ data: mockApiResponse } as any));

      const result = await service.searchBooks(mockSearchDto);

      expect(result).toMatchObject({
        items: expect.arrayContaining([
          expect.objectContaining({
            title: 'Test Book',
            authors: [{ name: 'Test Author', key: '/authors/TA1' }],
          }),
        ]),
      });

      expect(httpService.get).toHaveBeenCalledWith(
        'https://openlibrary.org/search.json',
        expect.objectContaining({
          params: {
            q: 'test query',
            page: 1,
            limit: 10,
            fields: 'key,title,author_name,first_publish_year,cover_i',
          },
        }),
      );

      expect(cacheManager.set).toHaveBeenCalled();
    });

    it('should handle API errors properly', async () => {
      cacheManager.get.mockResolvedValueOnce(undefined);
      httpService.get.mockReturnValue(
        throwError(() => ({
          response: { data: 'Error' },
          message: 'API Error',
        })),
      );

      await expect(service.searchBooks(mockSearchDto)).rejects.toThrow();
    });

    it('should handle missing author information', async () => {
      const mockResponse = {
        ...mockApiResponse,
        docs: [
          {
            ...mockApiResponse.docs[0],
            author_name: undefined,
            author_key: undefined,
          },
        ],
      };

      cacheManager.get.mockResolvedValueOnce(undefined);
      httpService.get.mockReturnValue(of({ data: mockResponse } as any));

      const result = await service.searchBooks(mockSearchDto);

      expect(result.items[0].authors).toEqual([{ name: 'Unknown Author' }]);
    });
  });

  describe('buildResult', () => {
    it('should generate correct pagination links', () => {
      const books = [
        {
          key: '/works/OL1W',
          title: 'Test Book',
          authors: [{ name: 'Test Author', key: '/authors/TA1' }],
          first_publish_year: 2023,
          cover_image: 'https://covers.openlibrary.org/b/id/12345-M.jpg',
          url: 'https://openlibrary.org/works/OL1W',
        },
      ];

      const result = (service as any).buildResult('test', 2, 10, 25, books);

      expect(result).toMatchObject({
        items: books,
        total: 25,
        page: 2,
        limit: 10,
        _links: {
          self: expect.stringContaining('page=2'),
          prev: expect.stringContaining('page=1'),
          next: expect.stringContaining('page=3'),
          last: expect.stringContaining('page=3'),
        },
      });
    });
  });
});
