import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateStudentDto,
  DeleteStudentDto,
  SearchStudentDto,
  UpdateStudentDto,
} from './dto';
import { StudentsService } from './students.service';
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Patch()
  async update(@Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(updateStudentDto);
  }

  @Delete()
  async delete(@Body() deleteStudentDto: DeleteStudentDto) {
    return this.studentsService.delete(deleteStudentDto);
  }

  @Get()
  async search(@Query() searchStudentDto: SearchStudentDto) {
    return this.studentsService.search(searchStudentDto);
  }
}
