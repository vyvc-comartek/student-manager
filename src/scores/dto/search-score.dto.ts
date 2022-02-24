import { IsInt, IsOptional, Matches, Min } from 'class-validator';

export class SearchScoreDto {
  @Matches(/\d(.\d)?([><]=?\d(.\d)?)?/g)
  @IsOptional()
  readonly score?: string;

  @Min(0)
  @IsInt()
  @IsOptional()
  readonly subjectId?: number;

  @Min(0)
  @IsInt()
  @IsOptional()
  readonly studentId?: number;
}
