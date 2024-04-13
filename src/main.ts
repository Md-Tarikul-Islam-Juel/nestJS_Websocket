import {NestFactory} from '@nestjs/core';
import {rateLimit} from 'express-rate-limit';
import {AppModule} from './app.module';
import {AllExceptionsFilter} from './modules/filters/all-exceptions.filter';
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

const limiter = rateLimit({
    //from per ip we allow max 5/min
    windowMs: 1000 * 60, // 1 minutes
    limit: 50, // Maximum 50 requests per IP in 1 minutes
    message: 'Too many requests, please try again later.',
});

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {abortOnError: false});

    app.useGlobalFilters(new AllExceptionsFilter());
    app.use('/auth', limiter); // Apply rate limiting to authentication(/auth) route

    //validate all incoming packets based on all DTOs
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        // disableErrorMessages:true
        // transform: true,
    }));

    //Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('NestJs Socket Boilerplate')
        .setDescription('')
        .setVersion('1.0')
        .addTag('')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}

bootstrap();
