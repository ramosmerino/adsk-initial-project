import { Test, TestingModule } from '@nestjs/testing';
import { OpenLibraryService } from './open-library.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';

describe('OpenLibraryService', () => {
  let service: OpenLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<OpenLibraryService>(OpenLibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
