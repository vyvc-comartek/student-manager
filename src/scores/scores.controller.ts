import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateScoreDto,
  DeleteScoreDto,
  SearchScoreDto,
  UpdateScoreDto,
} from './dto';
import { ScoresService } from './scores.service';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  async create(@Body() createScoreDto: CreateScoreDto) {
    return this.scoresService.create(createScoreDto);
  }

  @Patch()
  async update(@Body() updateScoreDto: UpdateScoreDto) {
    return this.scoresService.update(updateScoreDto);
  }

  @Delete()
  async delete(@Body() deleteScoreDto: DeleteScoreDto) {
    return this.scoresService.delete(deleteScoreDto);
  }

  @Get()
  async search(@Query() searchScoreDto: SearchScoreDto) {
    return this.scoresService.search(searchScoreDto);
  }
}
