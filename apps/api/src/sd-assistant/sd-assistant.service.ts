import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  checkRunCompleteStatusUseCase,
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
  getMessageListUseCase,
} from './use-cases';
import { QuestionDto } from './dtos';

@Injectable()
export class SdAssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    const { id } = await createThreadUseCase(this.openai);
    return { id };
  }

  async userQuestion({ threadId, question }: QuestionDto) {
    await createMessageUseCase(this.openai, {
      threadId,
      question,
    });

    const run = await createRunUseCase(this.openai, { threadId });

    await checkRunCompleteStatusUseCase(this.openai, {
      threadId,
      runId: run.id,
    });

    const messages = await getMessageListUseCase(this.openai, {
      threadId,
    });

    return messages.reverse();
  }
}
