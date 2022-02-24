import { Injectable } from '@nestjs/common';
import {
  CreateStudentDto,
  DeleteStudentDto,
  SearchStudentDto,
  UpdateStudentDto,
} from './dto';

@Injectable()
export class StudentsService {
  async create(createStudentDto: CreateStudentDto) {}
  async update(updateStudentDto: UpdateStudentDto) {}
  async delete(deleteStudentDto: DeleteStudentDto) {}
  async search(searchStudentDto: SearchStudentDto) {}
}
