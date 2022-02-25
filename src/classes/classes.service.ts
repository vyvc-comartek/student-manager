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

  async create(createClassDto: CreateClassDto) {
    return this.classesRepository.insert(createClassDto);
  }

  async update({ id, ...classProps }: UpdateClassDto) {
    return this.classesRepository.update({ id }, classProps);
  }

  async delete({ id }: DeleteClassDto) {
    return this.classesRepository.delete({ id });
  }

  async search(searchClassDto: SearchClassDto) {
    const results = await this.classesRepository.findOne({
      relations: ['students'],
      ...searchClassDto,
    });
    return results;
  }
}
