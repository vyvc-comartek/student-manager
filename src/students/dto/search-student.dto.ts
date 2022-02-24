import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class SearchStudentDto {
  @Min(0)
  @IsInt()
  @IsOptional()
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

  @Min(0)
  @IsInt()
  @IsOptional()
  readonly classId?: number;
}
