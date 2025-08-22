import * as convict from 'convict';

export const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  server: {
    port: {
      doc: 'The port to bind.',
      format: 'port',
      default: 3000,
      env: 'PORT',
    },
    api: {
      prefix: {
        doc: 'API route prefix',
        format: String,
        default: 'api',
        env: 'API_PREFIX',
      },
      version: {
        doc: 'API version',
        format: String,
        default: '1',
        env: 'API_VERSION',
      },
    },
  },
  cache: {
    ttl: {
      doc: 'Cache time-to-live in milliseconds',
      format: 'int',
      default: 3600000,
      env: 'CACHE_TTL',
    },
    max: {
      doc: 'Maximum number of items in cache',
      format: 'int',
      default: 100,
      env: 'CACHE_MAX_ITEMS',
    },
  },
  throttler: {
    ttl: {
      doc: 'Time window in milliseconds',
      format: 'int',
      default: 60000,
      env: 'THROTTLE_TTL',
    },
    limit: {
      doc: 'Maximum number of requests within the TTL',
      format: 'int',
      default: 10,
      env: 'THROTTLE_LIMIT',
    },
  },
  openlibrary: {
    baseUrl: {
      doc: 'OpenLibrary API base URL',
      format: String,
      default: 'https://openlibrary.org',
      env: 'OPENLIBRARY_BASE_URL',
    },
  },
});

config.validate({ allowed: 'strict' });

export default config;
