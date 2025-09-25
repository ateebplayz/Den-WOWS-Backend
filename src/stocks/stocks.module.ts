import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../users/schemas/user.schema";
import {Stock, StocksSchema} from "./schemas/stocks.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Stock.name, schema: StocksSchema }])],
  controllers: [StocksController],
  providers: [StocksService]
})
export class StocksModule {}
