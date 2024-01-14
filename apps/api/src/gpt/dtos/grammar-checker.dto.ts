import { IsString, IsInt, IsOptional } from 'class-validator';

export class GrammarCheckerDto {
  @IsString()
  readonly prompt: string;

  @IsInt()
  @IsOptional()
  readonly maxTokens: number;
}
