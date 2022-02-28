import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/classes/class.entity';
import { Repository } from 'typeorm';
import {
  CreateStudentDto,
  DeleteStudentDto,
  SearchStudentDto,
  UpdateStudentDto,
} from './dto';
import { Student } from './student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  async create({ class: clss, ...createStudentDto }: CreateStudentDto) {
    const newStudent = {
      ...createStudentDto,
      class: { id: clss } as Class,
    };
    return this.studentsRepository.insert(newStudent);
  }

  async update({ id, class: clss, ...updateStudentDto }: UpdateStudentDto) {
    const newStudent = {
      ...updateStudentDto,
      class: { id: clss } as Class,
    };
    return this.studentsRepository.update({ id }, newStudent);
  }

  async delete({ id }: DeleteStudentDto) {
    return this.studentsRepository.delete({ id });
  }

  async search(searchStudentDto: SearchStudentDto) {
    const user = await this.studentsRepository.findOne({
      relations: ['class'],
      ...searchStudentDto,
    });
    return user;
  }
}
