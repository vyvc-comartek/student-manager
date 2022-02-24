import { IsInt, IsOptional, Matches, Min } from 'class-validator';
export class SearchClassDto {
  @Min(0)
  @IsInt()
  @IsOptional()
  readonly id?: number;

  @IsOptional()
  readonly name?: string;

  @Matches(/\d([><]=?\d)?/g)
  @IsOptional()
  readonly totalMember?: string;

  @IsOptional()
  readonly teacherName?: string;
}
