import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/classes/class.entity';
import { ILike, Raw, Repository } from 'typeorm';
import { SqlHttpMappingHandler } from '../general/sql-http-mapping.handler';
import { Score } from '../scores/score.entity';
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
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
  ) {}

  async create({ class: clss, ...createStudentDto }: CreateStudentDto) {
    const newStudent = {
      ...createStudentDto,
      class: { id: clss } as Class,
    };

    return SqlHttpMappingHandler.handle(
      this.studentsRepository.insert(newStudent),
    ).then((value) => {
      //Cập nhật totalMember trong bảng Class khi insert Student thành công
      SqlHttpMappingHandler.handle(
        this.classesRepository.increment({ id: clss }, 'totalMember', 1),
      );
      return value;
    });
  }

  async update({ id, class: clss, ...updateStudentDto }: UpdateStudentDto) {
    const newStudent = {
      ...updateStudentDto,
      class: { id: clss } as Class,
    };
    return SqlHttpMappingHandler.handle(
      this.studentsRepository.update({ id }, newStudent),
    );
  }

  async delete({ id }: DeleteStudentDto) {
    return SqlHttpMappingHandler.handle(this.studentsRepository.delete({ id }));
  }

  async search({
    id,
    name,
    class: clss,
    score,
    itemsPerPage,
    page,
  }: SearchStudentDto) {
    //Nếu có trường id, trả về 1 kết quả dựa trên id
    if (id) return this.studentsRepository.findOne(id);

    //Nếu không có trường id, tạo queryBuilder
    let queryBuilder = this.studentsRepository.createQueryBuilder();

    //Thực hiện nhảy tới trang cần get dựa trên page và itemsPerPage
    queryBuilder = queryBuilder
      .skip((page - 1) * itemsPerPage)
      .take(itemsPerPage);

    //Join bảng
    queryBuilder = queryBuilder
      .leftJoin('Student.class', 'Class')
      .leftJoin('Student.scores', 'Score')
      .addSelect(['Student.*']);

    if (score)
      queryBuilder = queryBuilder
        .addSelect((sq) => {
          //Đếm số môn mà học sinh đã tham gia học
          return sq
            .select('COUNT(Score.id)', 'countSubject')
            .from(Score, 'Score')
            .where('Score.studentId=Student.id');
        }, 'countSubject')
        .addSelect((sq) => {
          //Đếm số môn mà học sinh đã tham gia học và đạt điểm trong khoảng <score>
          return sq
            .select('COUNT(Score.id)', 'countScore')
            .from(Score, 'Score')
            .where({
              score: this.getScoreCondition(score),
            })
            .andWhere('Score.studentId=Student.id');
        }, 'countScore')
        //Nếu số môn tham gia học = Số môn đạt điểm cao thì select student này
        .having('countSubject=countScore');

    if (name)
      queryBuilder = queryBuilder.andWhere({
        name: ILike(`%${name}%`),
      });

    if (clss)
      queryBuilder = queryBuilder.andWhere({
        class: clss,
      });

    return {
      result: await queryBuilder.getMany(),
      page: page,
    };
  }

  private getScoreCondition(score: string | [string, 'AND' | 'OR', string]) {
    if (typeof score === 'string') return Raw((alias) => alias + score);
    //score<=4
    else
      return Raw(
        (alias) => `${alias}${score[0]} ${score[1]} ${alias}${score[2]}`, //score>=7.8 AND score<=9
      );
  }
}
