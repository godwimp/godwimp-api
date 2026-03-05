import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateVisitDto {
  @IsNotEmpty()
  @IsString()
  page!: string;

  @IsOptional()
  @IsString()
  referrer?: string;
}
