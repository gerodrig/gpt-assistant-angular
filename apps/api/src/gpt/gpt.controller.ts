import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GrammarCheckerDto } from './dtos/';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('grammar-checker')
  grammarCheck(@Body() grammarCheckerDto: GrammarCheckerDto) {
    return this.gptService.grammarCheck(grammarCheckerDto);
  }
}
