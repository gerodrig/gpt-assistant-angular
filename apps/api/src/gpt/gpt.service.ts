import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

import { GrammarCheckerDto, ProsConsEvaluatorDto } from './dtos';
import {
  grammarCheckUseCase,
  prosConsEvaluatorStreamUseCase,
  prosConsEvaluatorUseCase,
} from './use-cases';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async grammarCheck({ prompt }: GrammarCheckerDto) {
    return await grammarCheckUseCase(this.openai, { prompt });
  }

  async prosConsEvaluator({ prompt }: ProsConsEvaluatorDto) {
    return await prosConsEvaluatorUseCase(this.openai, { prompt });
  }

  async prosConsEvaluatorStream({ prompt }: ProsConsEvaluatorDto) {
    return await prosConsEvaluatorStreamUseCase(this.openai, { prompt });
  }
}
