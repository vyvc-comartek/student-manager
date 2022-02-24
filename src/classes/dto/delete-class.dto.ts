import { IsInt, Min } from 'class-validator';

export class DeleteClassDto {
  @Min(0)
  @IsInt()
  readonly id: number;
}
