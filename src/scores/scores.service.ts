import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/students/student.entity';
import { Subject } from 'src/subjects/subject.entity';
import { FindConditions, Repository } from 'typeorm';
import {
  CreateScoreDto,
  DeleteScoreDto,
  SearchScoreDto,
  UpdateScoreDto,
} from './dto';
import { Score } from './score.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private readonly scoresRepository: Repository<Score>,
  ) {}

  async create({ student, subject, ...createScoreDto }: CreateScoreDto) {
    const newScore = {
      ...createScoreDto,
      student: { id: student } as Student,
      subject: { id: subject } as Subject,
    };
    return this.scoresRepository.insert(newScore);
  }

  async update({ id, student, subject, score }: UpdateScoreDto) {
    //updateById nếu id được cung cấp, updateByStudentSubjectId nếu id không được cung cấp
    return this.scoresRepository.update(
      id ? { id } : ({ student, subject } as FindConditions<Score>),
      { score },
    );
  }

  async delete({ id, student, subject }: DeleteScoreDto) {
    return this.scoresRepository.delete(
      id ? { id } : ({ student, subject } as FindConditions<Score>),
    );
  }

  async search(searchScoreDto: SearchScoreDto) {
    const results = await this.scoresRepository.findOne({
      relations: ['student', 'subject'],
      ...searchScoreDto,
    });
    return results;
  }
}
