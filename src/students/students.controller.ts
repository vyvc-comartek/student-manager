import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClassesService } from 'src/classes/classes.service';
import {
  DatabaseExceptions,
  HttpExceptionMapper,
} from '../general/http-exception.mapper';
import { ScoresService } from '../scores/scores.service';
import {
  CreateStudentDto,
  DeleteStudentDto,
  SearchStudentDto,
  UpdateStudentDto,
} from './dto';
import { StudentsService } from './students.service';
@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly classesService: ClassesService,
    private readonly scoresService: ScoresService,
  ) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    const isClassExist = !(await this.classesService.checkExist({
      id: createStudentDto.class,
    }));

    if (isClassExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this.studentsService.create(createStudentDto);
  }

  @Patch()
  async update(@Body() updateStudentDto: UpdateStudentDto) {
    const isClassNotExist =
      updateStudentDto.class &&
      !(await this.classesService.checkExist({ id: updateStudentDto.class }));

    if (isClassNotExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this.studentsService.update(updateStudentDto);
  }

  @Delete()
  async delete(@Body() deleteStudentDto: DeleteStudentDto) {
    const isScoreExist = await this.scoresService.checkExist({
      student: deleteStudentDto.id,
    });

    if (isScoreExist)
      HttpExceptionMapper.throw(DatabaseExceptions.OBJ_REFERENCED);

    return this.studentsService.delete(deleteStudentDto);
  }

  @Get()
  async search(@Query() searchStudentDto: SearchStudentDto) {
    return this.studentsService.search(searchStudentDto);
  }
}
