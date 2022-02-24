import { IsInt, Min } from 'class-validator';
export class DeleteSubjectDto {
  @Min(0)
  @IsInt()
  readonly id: number;
}
