import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import {
  CreateClassDto,
  DeleteClassDto,
  SearchClassDto,
  UpdateClassDto,
} from './dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
  ) {}
  async create(createClassDto: CreateClassDto) {}
  async update(updateClassDto: UpdateClassDto) {}
  async delete(deleteClassDto: DeleteClassDto) {}
  async search(searchClassDto: SearchClassDto) {}
}
