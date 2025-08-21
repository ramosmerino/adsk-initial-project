import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TerminusModule } from "@nestjs/terminus";
import { ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BooksModule } from "./books/books.module";
import { OpenLibraryModule } from "./open-library/open-library.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env",
		}),
		CacheModule.register({
			isGlobal: true,
			ttl: 3600,
			max: 100,
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 10,
			},
		]),
		TerminusModule,
		BooksModule,
		OpenLibraryModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
