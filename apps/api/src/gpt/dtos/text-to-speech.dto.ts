import { IsOptional, IsString } from 'class-validator';
import { Voice } from '../../interfaces';

export class TextToSpeechDto {
  @IsString()
  readonly text: string;

  @IsString()
  @IsOptional()
  readonly voice: Voice;
}
