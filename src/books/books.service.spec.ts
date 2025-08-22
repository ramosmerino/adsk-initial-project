import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { OpenLibraryService } from '@app/open-library/open-library.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        OpenLibraryService,
        {
          provide: HttpService,
          useValue: {
            delete: jest.fn(),
            get: jest.fn(),
            post: jest.fn(),
          },
        },
        { provide: CACHE_MANAGER, useValue: {} },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
