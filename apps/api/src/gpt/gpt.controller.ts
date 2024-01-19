import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GrammarCheckerDto, ProsConsEvaluatorDto } from './dtos/';
import { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('grammar-checker')
  grammarCheck(@Body() grammarCheckerDto: GrammarCheckerDto) {
    return this.gptService.grammarCheck(grammarCheckerDto);
  }

  @Post('pros-cons-evaluator')
  prosConsEvaluator(@Body() prosConsEvaluator: ProsConsEvaluatorDto) {
    return this.gptService.prosConsEvaluator(prosConsEvaluator);
  }

  @Post('pros-cons-evaluator-stream')
  async prosConsEvaluatorStream(
    @Body() prosConsEvaluator: ProsConsEvaluatorDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsEvaluatorStream(prosConsEvaluator);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0]?.delta.content || '';
      res.write(piece);
    }

    res.end();
  }
}
