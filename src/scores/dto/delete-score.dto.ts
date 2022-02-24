import { IsInt, IsOptional, Min, ValidateIf } from 'class-validator';

export class DeleteScoreDto {
  @Min(0)
  @IsInt()
  @IsOptional()
  readonly id?: number;

  @ValidateIf((o) => !('id' in o))
  @Min(0)
  @IsInt()
  readonly subjectId?: number;

  @ValidateIf((o) => 'subjectId' in o)
  @Min(0)
  @IsInt()
  readonly studentId?: number;
}
