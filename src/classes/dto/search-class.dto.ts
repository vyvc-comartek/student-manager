import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Length,
  Matches,
} from 'class-validator';
import { PaginationDto } from 'src/modules/pagination.dto';

export class SearchClassDto extends PaginationDto {
  @IsPositive()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly id?: number;

  @Length(1, 60)
  @IsOptional()
  readonly name?: string;

  /**
   * totalMember được truyền có thể là một trong 3 kiểu sau:
   * - Cố định: totalMember=10
   * - Trong khoảng trái hoặc phải của trục số: totalMember=>=5
   * - Trong khoảng giữa của trục số: totalMember=<=5OR>8
   */
  @IsOptional()
  @Transform(({ value }) => {
    const values = (value as string).match(
      /([<>]=?)?(\d+)((AND|OR)([<>]=?)(\d+))?/,
    );
    if (values.at(-1)) return [values[1], values[4], values[5]];
    else if (!values[2]) return values[1];
    else return values[1];
  })
  readonly totalMember?: string | [string, 'AND' | 'OR', string];

  @Length(1, 60)
  @IsOptional()
  readonly teacherName?: string;

  @IsEnum({
    AND: 'AND',
    OR: 'OR',
  })
  @IsOptional()
  readonly operator: 'AND' | 'OR';
}
