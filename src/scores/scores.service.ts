import { Injectable } from '@nestjs/common';
import {
  CreateScoreDto,
  DeleteScoreDto,
  SearchScoreDto,
  UpdateScoreDto,
} from './dto';

@Injectable()
export class ScoresService {
  async create(createScoreDto: CreateScoreDto) {}

  async update(updateScoreDto: UpdateScoreDto) {}

  async delete(deleteScoreDto: DeleteScoreDto) {}

  async search(searchScoreDto: SearchScoreDto) {}
}
