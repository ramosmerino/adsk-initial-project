import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import axios, { AxiosError } from 'axios';
import type { SearchBooksDto } from '../books/dto/search-books.dto';
import type { BookSearchResultDto } from '../books/dto/book-response.dto';
import type {
  OpenLibrarySearchResponse,
  OpenLibraryBook,
} from './interfaces/openlibrary-response.interface';
import { HttpService } from '@nestjs/axios';
import config from '@app/shared/config/env.config';
import { firstValueFrom, catchError } from 'rxjs';

@Injectable()
export class OpenLibraryService {
  private readonly logger = new Logger(OpenLibraryService.name);
  private readonly baseUrl = config.get('openlibrary.baseUrl');
  private readonly cacheTtl: number = config.get('cache.ttl');

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
  ) {}

  async searchBooks(searchDto: SearchBooksDto): Promise<BookSearchResultDto> {
    const { query, page = 1, limit = 10 } = searchDto;
    const cacheKey = this.getCacheKey(query, page, limit);

    const cached = await this.cacheManager.get<BookSearchResultDto>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchBooks(query, page, limit);
      const books = this.mapBooks(data.docs);
      const result = this.buildResult(query, page, limit, data.numFound, books);

      await this.cacheManager.set(cacheKey, result, this.cacheTtl);
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  private getCacheKey(query: string, page: number, limit: number): string {
    return `search:${query}:${page}:${limit}`;
  }

  private async fetchBooks(
    query: string,
    page: number,
    limit: number,
  ): Promise<OpenLibrarySearchResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<OpenLibrarySearchResponse>(`${this.baseUrl}/search.json`, {
          params: {
            q: query,
            page,
            limit,
            fields: 'key,title,author_name,first_publish_year,cover_i',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data || error.message);
            throw new Error('OpenLibrary API request failed');
          }),
        ),
    );
    return data;
  }

  private mapBooks(docs: OpenLibraryBook[]) {
    return docs.map((book: OpenLibraryBook) => ({
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
  }

  private buildResult(
    query: string,
    page: number,
    limit: number,
    total: number,
    books: any[],
  ): BookSearchResultDto {
    const totalPages = Math.ceil(total / limit);
    const baseUrl = config.get<string>('server.api.prefix');

    const links: Record<string, string> = {
      self: `${baseUrl}/books?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      last: `${baseUrl}/books?query=${encodeURIComponent(query)}&page=${totalPages}&limit=${limit}`,
    };

    if (page > 1) {
      links.prev = `${baseUrl}/books?query=${encodeURIComponent(query)}&page=${
        page - 1
      }&limit=${limit}`;
    }
    if (page < totalPages) {
      links.next = `${baseUrl}/books?query=${encodeURIComponent(query)}&page=${
        page + 1
      }&limit=${limit}`;
    }

    return {
      items: books,
      total,
      page,
      limit,
      _links: links,
    };
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      this.logger.error(
        'OpenLibrary API error:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to fetch books from OpenLibrary API');
    }
    throw error;
  }
}
