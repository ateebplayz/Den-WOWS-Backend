import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {StocksService} from "./stocks.service";
import {AdminKeyGuard} from "../auth/admin-key.guard";
import {CreateStockDto} from "./dto/create-stock.dto";
import {UpdateStockDto} from "./dto/update-stock.dto";

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('')
  async getStocks() {
    return this.stocksService.getStocks();
  }

  @Post('')
  @UseGuards(AdminKeyGuard)
  async createStock(@Body() createStockDto: CreateStockDto) {
    return this.stocksService.createStock(createStockDto)
  }

  @Patch(':id')
  @UseGuards(AdminKeyGuard)
  async updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: Partial<UpdateStockDto>,
  ) {
    return this.stocksService.updateStock(id, updateStockDto);
  }

  @Delete(':id')
  @UseGuards(AdminKeyGuard)
  async deleteStock(
    @Param('id') id: string,
  ) {
    return this.stocksService.deleteStock(id);
  }
}
