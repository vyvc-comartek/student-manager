import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Matches } from 'class-validator';
export class SearchClassDto {
  @IsPositive()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly id?: number;

  @IsOptional()
  readonly name?: string;

  @Matches(/\d([><]=?\d)?/g)
  @IsOptional()
  readonly totalMember?: string;

  @IsOptional()
  readonly teacherName?: string;
}
