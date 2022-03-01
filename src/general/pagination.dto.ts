import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max } from 'class-validator';

export class PaginationDto {
  @Max(15)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly itemsPerPage: number = 3;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly page: number = 1;
}
