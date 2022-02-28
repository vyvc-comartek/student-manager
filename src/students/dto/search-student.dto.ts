import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Length,
  Matches,
} from 'class-validator';

export class SearchStudentDto {
  @IsPositive()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly id?: number;

  @Length(3, 60)
  @IsOptional()
  readonly name?: string;

  @Matches(/\d([><]=?\d)?/g)
  @IsOptional()
  readonly dob?: string;

  @IsEnum({
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other',
  } as const)
  @IsOptional()
  readonly gender?: 'Male' | 'Female' | 'Other';

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @Expose({ name: 'classId' })
  @IsPositive()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly class?: number;
}
