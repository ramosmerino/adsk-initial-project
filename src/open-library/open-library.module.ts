import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenLibraryService } from './open-library.service';

@Module({
  imports: [ConfigModule],
  providers: [OpenLibraryService],
  exports: [OpenLibraryService],
})
export class OpenLibraryModule {}
