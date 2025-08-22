import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class SearchBooksDto {
  @ApiProperty({
    description: 'Search query to find books by title or author',
    example: 'harry potter',
  })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'Number of results per page',
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
