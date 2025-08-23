<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">OpenLibrary API Challenge - A NestJS application for searching books using the OpenLibrary API</p>
<p align="center">
<a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/@nestjs/common" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://github.com/nestjs/nest/actions" target="_blank"><img src="https://github.com/nestjs/nest/workflows/CI/badge.svg" alt="CI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>

## Description

This project is a coding challenge for Autodesk that implements a book search service using the OpenLibrary API. The service provides a clean, well-documented API for searching books with features like caching, request validation, and HATEOAS support.

## Tech Stack

- **Runtime**: Node.js 22.x
- **Framework**: NestJS 10.x
- **HTTP Server**: Fastify
- **Testing**: Jest
- **Containerization**: Docker
- **Caching**: Redis
- **API Documentation**: Swagger/OpenAPI

## Development Installation

### Prerequisites

- Node.js 22.x (recommend using [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn
- Docker (optional, for containerized development)

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd adsk-initial-project
   ```

2. Install dependencies:
   ```bash
   # Using fnm
   fnm use
   
   # Or using nvm
   nvm use
   
   # Install dependencies
   npm install
   ```

3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

5. Access the API documentation at: http://localhost:3000/api

## Docker Installation

1. Build the Docker image:
   ```bash
   docker build -t openlibrary-api .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env openlibrary-api
   ```

3. Access the API at: http://localhost:3000

## API Endpoints

### Search Books

Search for books by title, author, or subject.

**Request:**
```http
GET /books/search?q=ulysses&page=1&limit=10
```

**Response:**
```json
{
  "query": "ulysses",
  "page": 1,
  "limit": 10,
  "total": 42,
  "books": [
    {
      "title": "Ulysses: The corrected text",
      "author_name": ["James Joyce"],
      "first_publish_year": 2004,
      "isbn": ["9780394553733"],
      "cover_i": 1234567
    }
  ],
  "_links": {
    "self": "/books/search?q=ulysses&page=1&limit=10",
    "next": "/books/search?q=ulysses&page=2&limit=10",
    "prev": null
  }
}
```

### Get Book Details

Get detailed information about a specific book by its OpenLibrary ID.

**Request:**
```http
GET /books/OL1234567M
```

**Response:**
```json
{
  "title": "Ulysses: The corrected text",
  "authors": [
    {
      "name": "James Joyce",
      "key": "/authors/OL23919A"
    }
  ],
  "publish_date": "2004-06-26",
  "description": "Written over a seven-year period, from 1914 to 1921...",
  "subjects": ["Novel", "Modernism", "Ireland"],
  "cover": {
    "small": "http://covers.openlibrary.org/b/id/0012722381-S.jpg",
    "medium": "http://covers.openlibrary.org/b/id/0012722381-M.jpg",
    "large": "http://covers.openlibrary.org/b/id/0012722381-L.jpg"
  },
  "identifiers": {
    "isbn_10": ["0394553732"],
    "isbn_13": ["9780394553733"],
    "openlibrary": ["OL23096847M"]
  }
}
```

## Contribute

This repository was created as part of a coding challenge for Autodesk and is not currently accepting external contributions. However, if you have suggestions or find any issues, feel free to open an issue.

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [OpenLibrary API](https://openlibrary.org/developers/api)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)

## License

This project is [MIT licensed](LICENSE).
