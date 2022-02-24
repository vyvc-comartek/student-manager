import { Injectable } from '@nestjs/common';
import {
  CreateSubjectDto,
  DeleteSubjectDto,
  SearchSubjectDto,
  UpdateSubjectDto,
} from './dto';

@Injectable()
export class SubjectsService {
  async create(createSubjectDto: CreateSubjectDto) {}
  async update(updateSubjectDto: UpdateSubjectDto) {}
  async delete(deleteSubjectDto: DeleteSubjectDto) {}
  async search(searchSubjectDto: SearchSubjectDto) {}
}
