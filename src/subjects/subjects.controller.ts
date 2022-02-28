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
  CreateSubjectDto,
  DeleteSubjectDto,
  SearchSubjectDto,
  UpdateSubjectDto,
} from './dto';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Patch()
  update(@Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(updateSubjectDto);
  }

  @Delete()
  delete(@Body() deleteSubjectDto: DeleteSubjectDto) {
    return this.subjectsService.delete(deleteSubjectDto);
  }

  @Get()
  search(@Query() searchSubjectDto: SearchSubjectDto) {
    return this.subjectsService.search(searchSubjectDto);
  }
}
