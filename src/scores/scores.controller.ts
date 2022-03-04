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
import * as XlsxTemplate from 'xlsx-template';
import { EmailService } from '../general/email/email.service';
import {
  DatabaseExceptions,
  HttpExceptionMapper,
} from '../general/http-exception.mapper';
import { SubjectsService } from '../subjects/subjects.service';
import {
  CreateScoreDto,
  DeleteScoreDto,
  SearchScoreDto,
  UpdateScoreDto,
} from './dto';
import { ScoresService } from './scores.service';

@Controller('scores')
export class ScoresController {
  constructor(
    private readonly scoresService: ScoresService,
    private readonly subjectsService: SubjectsService,
    private readonly studentsService: StudentsService,
    private readonly emailService: EmailService,
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

    return this.scoresService.create(createScoreDto).then(async (value) => {
      const score = await this.scoresService.search({
        id: value.raw.insertId,
      });

      const schema = await readFile('./xlsx-template/attch-email.xlsx');
      const template = new XlsxTemplate(schema);
      template.substitute(1, score);

      await this.emailService.sendEmail({
        to: score.student.email,
        subject: 'Điểm của bạn đã được cập nhật!',
        template: './email-template/score-added',
        attachments: [
          {
            filename: 'result.xlsx',
            contentType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            content: Buffer.from(template.generate('base64'), 'base64'),
          },
        ],
        context: score,
      });

      return value;
    });
  }

  @Patch()
  async update(@Body() updateScoreDto: UpdateScoreDto) {
    const isStudentNotExist =
      updateScoreDto.student &&
      !(await this.studentsService.checkExist({
        id: updateScoreDto.student,
      }));
    const isSubjectNotExist =
      updateScoreDto.subject &&
      !(await this.subjectsService.checkExist({
        id: updateScoreDto.subject,
      }));

    if (isStudentNotExist || isSubjectNotExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this.scoresService.update(updateScoreDto);
  }

  @Delete()
  async delete(@Body() deleteScoreDto: DeleteScoreDto) {
    const isStudentExist =
      deleteScoreDto.student &&
      (await this.studentsService.checkExist({
        id: deleteScoreDto.student,
      }));
    const isSubjectExist =
      deleteScoreDto.subject &&
      (await this.subjectsService.checkExist({
        id: deleteScoreDto.subject,
      }));

    if (isStudentExist || isSubjectExist)
      HttpExceptionMapper.throw(DatabaseExceptions.OBJ_REFERENCED);

    return this.scoresService.delete(deleteScoreDto);
  }

  @Get()
  async search(@Query() searchScoreDto: SearchScoreDto) {
    return this.scoresService.search(searchScoreDto);
  }
}
