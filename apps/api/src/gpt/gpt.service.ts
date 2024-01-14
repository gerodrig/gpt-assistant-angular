import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

import { GrammarCheckerDto } from './dtos';
import { grammarCheckUseCase } from './use-cases';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async grammarCheck({ prompt }: GrammarCheckerDto) {
    return await grammarCheckUseCase(this.openai, { prompt });
  }
}
