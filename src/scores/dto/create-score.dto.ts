import { IsDecimal, IsInt, Max, Min } from 'class-validator';
export class CreateScoreDto {
  @Min(0)
  @IsInt()
  readonly studentId: number;

  @Min(0)
  @IsInt()
  readonly subjectId: number;

  @Min(1)
  @Max(10)
  readonly score: number;
}
