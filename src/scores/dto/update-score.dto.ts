import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateScoreDto {
  @Min(0)
  @IsInt()
  readonly id: number;

  @Min(0)
  @IsInt()
  @IsOptional()
  readonly studentId?: number;

  @Min(0)
  @IsInt()
  @IsOptional()
  readonly subjectId?: number;

  @Min(1)
  @Max(10)
  readonly score: number;
}
