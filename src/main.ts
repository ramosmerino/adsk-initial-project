import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { description, name, version } from "../package.json";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({ logger: true }),
	);

	const configService = app.get(ConfigService);
	const port = configService.get<number>("PORT", 3000);
	const apiPrefix = configService.get<string>("API_PREFIX", "api");

	app.enableCors();

	app.setGlobalPrefix(apiPrefix);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle("Book Search API")
		.setDescription(description)
		.setVersion(version)
		.addTag("books")
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
		explorer: true,
		swaggerOptions: {
			filter: true,
			showRequestDuration: true,
		},
	});

	await app.listen(port, "0.0.0.0");
	console.log(`Application is running on: htt
  console.log(`Swagger documentation: htt
}

bootstrap().catch((error) => {
	console.error("Error starting the application:", error);
	process.exit(1);
});
