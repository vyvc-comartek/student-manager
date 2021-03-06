import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Patch,
  Post,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { readFile } from 'fs/promises';
import { ClassesService } from 'src/classes/classes.service';
import { ExcelService } from '../modules/excel/excel.service';
import {
  DatabaseExceptions,
  HttpExceptionMapper,
} from '../modules/http-exception.mapper';
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
    private readonly excelService: ExcelService,
  ) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    const isClassExist = await this.classesService.checkExist({
      id: createStudentDto.class,
    });

    if (!isClassExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this.studentsService
      .create(createStudentDto)
      .then(this._afterInsertStudent);
  }

  @Patch()
  async update(@Body() updateStudentDto: UpdateStudentDto) {
    let isClassExist = false;

    if (updateStudentDto.class) {
      isClassExist = await this.classesService.checkExist({
        id: updateStudentDto.class,
      });
    }

    if (isClassExist)
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

  @Get('excel')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  async excel(@Query() searchStudentDto: SearchStudentDto) {
    const [schema, data] = await Promise.all([
      await readFile('./xlsx-template/student.xlsx'),
      await this.studentsService.search(searchStudentDto),
    ]);

    const resultExcelData = await this.excelService.create({
      schema,
      data,
    });

    return new StreamableFile(resultExcelData);
  }

  private async _afterInsertStudent(insertedStudent) {
    //C???p nh???t totalMember trong b???ng Class khi insert Student th??nh c??ng
    this.classesService.updateTotalMember(insertedStudent.class);

    return insertedStudent;
  }
}
