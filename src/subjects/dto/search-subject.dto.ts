import { IsEnum, IsInt, IsOptional, Length, Min } from 'class-validator';

export class SearchSubjectDto {
  @Min(0)
  @IsInt()
  @IsOptional()
  readonly id?: number;

  @Length(3, 60)
  @IsOptional()
  readonly name?: string;

  @IsEnum({
    ONLINE: 'Online',
    OFFLINE: 'Offline',
  } as const)
  @IsOptional()
  readonly type?: 'Online' | 'Offline';
}
