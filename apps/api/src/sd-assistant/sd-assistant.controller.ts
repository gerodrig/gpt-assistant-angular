import { Body, Controller, Post } from '@nestjs/common';
import { SdAssistantService } from './sd-assistant.service';
import { QuestionDto } from './dtos';

@Controller('sd-assistant')
export class SdAssistantController {
  constructor(private readonly sdAssistantService: SdAssistantService) {}

  @Post('create-thread')
  async createThread() {
    return this.sdAssistantService.createThread();
  }

  @Post('user-question')
  async userQuestion(@Body() questionDto: QuestionDto) {
    return await this.sdAssistantService.userQuestion(questionDto);
  }
}
