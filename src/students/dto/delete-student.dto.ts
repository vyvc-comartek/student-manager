import { IsInt, Min } from 'class-validator';

export class DeleteStudentDto {
  @Min(0)
  @IsInt()
  readonly id: number;
}
