import { Injectable } from '@nestjs/common';
import {DeleteResult, Model, Types} from "mongoose";
import {Stock, StocksDocument} from "./schemas/stocks.schema";
import {InjectModel} from "@nestjs/mongoose";
import {CreateStockDto} from "./dto/create-stock.dto";
import {UpdateStockDto} from "./dto/update-stock.dto";

@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Stock.name) private stocksModel: Model<StocksDocument>
  ) {}

  getStocks(): Promise<StocksDocument[]> {
    return this.stocksModel.find().exec()
  }

  createStock(stock: CreateStockDto): Promise<StocksDocument> {
    return this.stocksModel.create({
      name: stock.name,
      price: stock.price,
      priceHistory: []
    })
  }

  deleteStock(stockId: string): Promise<DeleteResult> {
    return this.stocksModel.deleteOne({ _id: new Types.ObjectId(stockId) })
  }

  async updateStock(id: string, updateStockDto: Partial<UpdateStockDto>) {
    return this.stocksModel.findByIdAndUpdate(id, updateStockDto, { new: true }).exec();
  }
}
