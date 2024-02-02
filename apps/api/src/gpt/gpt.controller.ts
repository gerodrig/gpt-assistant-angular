import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { GptService } from './gpt.service';
import {
  GrammarCheckerDto,
  ImageGenerationDto,
  ImageVariationDto,
  ProsConsEvaluatorDto,
  SpeechToTextDto,
  TextToSpeechDto,
  TranslateDto,
} from './dtos/';
import { Response } from 'express';
import type { Stream } from 'openai/streaming';
import type { ChatCompletionChunk } from 'openai/resources';
import { CustomFileInterceptor } from '../interceptors/';
import { CustomAudioUpload } from './../decorators/';

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
  @Post('translate')
  async translateText(
    @Body() translateDto: TranslateDto,
    @Res() res: Response,
  ) {
    if (translateDto.stream) {
      const stream = (await this.gptService.translate(
        translateDto,
      )) as Stream<ChatCompletionChunk>;

      res.setHeader('Content-Type', 'application/json');
      res.status(HttpStatus.OK);

      for await (const chunk of stream) {
        const piece = chunk.choices[0]?.delta.content || '';
        res.write(piece);
      }

      res.end();
    } else {
      const result = await this.gptService.translate(translateDto);
      res.status(HttpStatus.OK).json(result);
    }
  }

  @Get('image-generation/:fileName')
  async audioGetter(@Param('fileName') fileName: string, @Res() res: Response) {
    //check that fileName is ending with png
    const fileExtension = fileName.split('.').pop();

    if (!fileExtension || fileExtension !== 'mp3') {
      throw new BadRequestException('Invalid file extension, mp3 was expected');
    }

    const fileStream = await this.gptService.fileGetter(fileName);
    res.setHeader('Content-Type', 'audio/mp3');
    fileStream.pipe(res);
  }

  @Get('text-to-speech/all')
  async textToSpeechFiles() {
    return await this.gptService.textToSpeechGetAllFiles();
  }

  @Post('text-to-speech')
  async textToSpeech(
    @Body() textToSpeechDto: TextToSpeechDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToSpeech(textToSpeechDto);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.redirect(filePath);
  }

  @Post('speech-to-text')
  @UseInterceptors(CustomFileInterceptor)
  async speechToText(
    @CustomAudioUpload() file: Express.Multer.File,
    @Body() speechToTextDto: SpeechToTextDto,
  ) {
    return await this.gptService.speechToText(file, speechToTextDto);
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return await this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:fileName')
  async imageGetter(@Param('fileName') fileName: string, @Res() res: Response) {
    //check that fileName is ending with png
    const fileExtension = fileName.split('.').pop();

    if (!fileExtension || fileExtension !== 'png') {
      throw new BadRequestException('Invalid file extension, png was expected');
    }

    const fileStream = await this.gptService.fileGetter(fileName);
    res.setHeader('Content-Type', 'image/png');
    fileStream.pipe(res);
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return await this.gptService.generateImageVariation(imageVariationDto);
  }
}
