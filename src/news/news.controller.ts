import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import {NewsService} from "./news.service";
import {AdminKeyGuard} from "../auth/admin-key.guard";
import {CreateNewsDto} from "./dto/create-news.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {FlagsService} from "../flags/flags.service";
import {News} from "./schemas/news.schema";
import {UpdateNewsDto} from "./dto/update-news.dto";

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly flagsService: FlagsService,
  ) {}

  @Get('/admin')
  @UseGuards(AdminKeyGuard)
  getNewsAdmin() {
    return this.newsService.getNews();
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getNews() {
    const allNews = await this.newsService.getNews();
    const flag = await this.flagsService.getFullFlag('global')

    if (flag) {
      const sorted = [...allNews].sort((a, b) => a.sequence - b.sequence);
      const triggered: News[] = [];
      let accumulatedTime = 0;

      for (const item of sorted) {
        accumulatedTime += item.effectAt;
        if (accumulatedTime <= flag.accumulatedSeconds) {
          triggered.push(item);
        } else {
          break;
        }
      }

      return triggered
    } else throw new InternalServerErrorException();
  }

  @Post('')
  @UseGuards(AdminKeyGuard)
  createNews(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.createNews(createNewsDto)
  }


  @Patch(':id')
  @UseGuards(AdminKeyGuard)
  updateNews(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.updateNews(id, updateNewsDto)
  }

  @Delete(':id')
  @UseGuards(AdminKeyGuard)
  deleteNews(@Param('id') id: string) {
    return this.newsService.deleteNews(id)
  }
}

