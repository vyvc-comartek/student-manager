import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { readFile } from 'fs/promises';
import { StudentsService } from 'src/students/students.service';
import { EmailService } from '../modules/email/email.service';
import { ExcelService } from '../modules/excel/excel.service';
import {
  DatabaseExceptions,
  HttpExceptionMapper,
} from '../modules/http-exception.mapper';
import { Student } from '../students/student.entity';
import { SubjectsService } from '../subjects/subjects.service';
import {
  CreateScoreDto,
  DeleteScoreDto,
  SearchScoreDto,
  UpdateScoreDto,
} from './dto';
import { Score } from './score.entity';
import { ScoresService } from './scores.service';

@Controller('scores')
export class ScoresController {
  constructor(
    private readonly scoresService: ScoresService,
    private readonly subjectsService: SubjectsService,
    private readonly studentsService: StudentsService,
    private readonly emailService: EmailService,
    private readonly excelService: ExcelService,
  ) {}

  @Post()
  async create(@Body() createScoreDto: CreateScoreDto) {
    const isStudentExist = await this.studentsService.checkExist({
      id: createScoreDto.student,
    });
    const isSubjectExist = await this.subjectsService.checkExist({
      id: createScoreDto.subject,
    });

    if (!isStudentExist || !isSubjectExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this.scoresService
      .create(createScoreDto)
      .then(this._afterInsertScore);
  }

  @Patch()
  async update(@Body() updateScoreDto: UpdateScoreDto) {
    let isStudentExist = true;
    let isSubjectExist = true;

    if (updateScoreDto.student)
      isStudentExist = await this.studentsService.checkExist({
        id: updateScoreDto.student,
      });

    if (updateScoreDto.subject)
      isSubjectExist = await this.subjectsService.checkExist({
        id: updateScoreDto.subject,
      });

    if (!isStudentExist || !isSubjectExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this.scoresService.update(updateScoreDto);
  }

  @Delete()
  async delete(@Body() deleteScoreDto: DeleteScoreDto) {
    let isStudentExist = false;
    let isSubjectExist = false;

    if (deleteScoreDto.student)
      isStudentExist = await this.studentsService.checkExist({
        id: deleteScoreDto.student,
      });

    if (deleteScoreDto.subject)
      isSubjectExist = await this.subjectsService.checkExist({
        id: deleteScoreDto.subject,
      });

    if (isStudentExist || isSubjectExist)
      HttpExceptionMapper.throw(DatabaseExceptions.OBJ_REFERENCED);

    return this.scoresService.delete(deleteScoreDto);
  }

  @Get()
  async search(@Query() searchScoreDto: SearchScoreDto) {
    const newSearchScoreDto = {
      ...searchScoreDto,
      ...{
        relations: [
          'student',
          'subject',
          'student.scores',
          'student.scores.subject',
        ],
      },
    } as SearchScoreDto;

    return this.scoresService.search(newSearchScoreDto);
  }

  private async _afterInsertScore(insertedScore) {
    const searchScore = this.scoresService.search({
      id: insertedScore.raw.insertId,
      relations: [
        'student',
        'subject',
        'student.scores',
        'student.scores.subject',
      ],
    });
    const readMailSchema = readFile('./xlsx-template/attch-email.xlsx');
    const readMailAllScoresSchema = readFile(
      './xlsx-template/attch-all-scores-email.xlsx',
    );
    const countSubjects = this.subjectsService.countSubjects();

    //Thực thi đồng thời truy vấn Score vừa tạo và đọc file xlsx schema
    const [score, schema, schemaAll, numberOfSubjects] = await Promise.all([
      searchScore,
      readMailSchema,
      readMailAllScoresSchema,
      countSubjects,
    ]);

    //Đổ dữ liệu vào schema để tạo tệp excel kết quả
    const excelScore = await this.excelService.create<Score>({
      schema,
      data: score,
    });

    const content = [excelScore];

    //Nếu tất cả các môn đều có điểm
    if (numberOfSubjects === score.student.scores.length) {
      const excelAllScores = await this.excelService.create<Student>({
        schema: schemaAll,
        data: score.student,
      });

      content.push(excelAllScores);
    }

    //Gửi email
    this.emailService.sendWhenScoreAdded({
      score,
      content,
    });

    return insertedScore;
  }
}
