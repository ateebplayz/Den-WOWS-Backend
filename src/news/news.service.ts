import { Injectable } from '@nestjs/common';
import {News, NewsDocument} from "./schemas/news.schema";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {CreateNewsDto} from "./dto/create-news.dto";

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
  ) {}

  async createNews(news: CreateNewsDto): Promise<NewsDocument> {
    return this.newsModel.create(news)
  }

  async getNews(): Promise<Array<NewsDocument>> {
    return this.newsModel.find().exec()
  }
}
