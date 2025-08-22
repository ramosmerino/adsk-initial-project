import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import axios, { type AxiosError } from 'axios';
import type { SearchBooksDto } from '../books/dto/search-books.dto';
import type { BookSearchResultDto } from '../books/dto/book-response.dto';
import type { OpenLibrarySearchResponse, OpenLibraryBook } from './interfaces/openlibrary-response.interface';
import { HttpService } from '@nestjs/axios';
import config from 'src/shared/config/env.config';
import { firstValueFrom, catchError } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class OpenLibraryService {
  private readonly logger = new Logger(OpenLibraryService.name);
  private readonly baseUrl = 'https://openlibrary.org';
  private readonly cacheTtl: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService
  ) {
    this.cacheTtl = config.get('cache.ttl')
  }

  async searchBooks(searchDto: SearchBooksDto): Promise<BookSearchResultDto> {
    const { query, page = 1, limit = 10 } = searchDto;
    const cacheKey = `search:${query}:${page}:${limit}`;

    const cachedResult = await this.cacheManager.get<BookSearchResultDto>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<OpenLibrarySearchResponse>(`${this.baseUrl}/search.json`, {
          params: {
            q: query,
            page,
            limit,
            fields: 'key,title,author_name,first_publish_year,cover_i',
          },
        }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
      );

      const books = data.docs.map((book: OpenLibraryBook) => ({
        key: book.key,
        title: book.title,
        authors: book.author_name?.map((name, index) => ({
          name,
          key: book.author_key?.[index],
        })) || [{ name: 'Unknown Author' }],
        first_publish_year: book.first_publish_year,
        cover_image: book.cover_i 
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
          : undefined,
        url: `https://openlibrary.org${book.key}`,
      }));

      const total = data.numFound;
      const totalPages = Math.ceil(total / limit);

      const baseUrl = config.get<string>('server.api.prefix');
      const links: Record<string, string> = {
        self: `${baseUrl}/books?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      };

      if (page > 1) {
        links.prev = `${baseUrl}/books?query=${encodeURIComponent(query)}&page=${page - 1}&limit=${limit}`;
      }

      if (page < totalPages) {
        links.next = `${baseUrl}/books?query=${encodeURIComponent(query)}&page=${page + 1}&limit=${limit}`;
      }

      links.last = `${baseUrl}/books?query=${encodeURIComponent(query)}&page=${totalPages}&limit=${limit}`;

      const result: BookSearchResultDto = {
        items: books,
        total,
        page,
        limit,
        _links: links,
      };

      await this.cacheManager.set(cacheKey, result, this.cacheTtl * 1000);

      return result;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('OpenLibrary API error:', 
          axiosError.response?.data || axiosError.message
        );
        throw new Error('Failed to fetch books from OpenLibrary API');
      }
      throw error;
    }
  }
}
