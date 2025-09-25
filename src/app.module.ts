import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FlagsModule } from './flags/flags.module';
import { StocksModule } from './stocks/stocks.module';
import { NewsService } from './news/news.service';
import { NewsController } from './news/news.controller';
import { NewsModule } from './news/news.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost/nest-auth'),
    UsersModule,
    AuthModule,
    FlagsModule,
    StocksModule,
    NewsModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
