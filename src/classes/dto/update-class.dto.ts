import { IsInt, IsOptional, Length, Min } from 'class-validator';

export class UpdateClassDto {
  @Min(0)
  @IsInt()
  readonly id: number;

  @Length(3, 60)
  @IsOptional()
  readonly name?: string;

  @Length(3, 60)
  @IsOptional()
  readonly teacherName?: string;
}
