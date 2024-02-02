import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

import {
  GrammarCheckerDto,
  ProsConsEvaluatorDto,
  TranslateDto,
  TextToSpeechDto,
  SpeechToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
} from './dtos';
import {
  grammarCheckUseCase,
  prosConsEvaluatorStreamUseCase,
  prosConsEvaluatorUseCase,
  textToSpeechUseCase,
  translateUseCase,
  speechToTextUseCase,
  imageGenerationUseCase,
  imageVariationUseCase,
} from './use-cases';
import { S3Adapter } from '../adapters/s3.adapter';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(private readonly s3Adapter: S3Adapter) {}

  async grammarCheck({ prompt }: GrammarCheckerDto) {
    return await grammarCheckUseCase(this.openai, { prompt });
  }

  async prosConsEvaluator({ prompt }: ProsConsEvaluatorDto) {
    return await prosConsEvaluatorUseCase(this.openai, { prompt });
  }

  async prosConsEvaluatorStream({ prompt }: ProsConsEvaluatorDto) {
    return await prosConsEvaluatorStreamUseCase(this.openai, { prompt });
  }

  async translate({ prompt, language, stream = false }: TranslateDto) {
    return await translateUseCase(this.openai, { prompt, language, stream });
  }

  async textToSpeech({ text, voice }: TextToSpeechDto) {
    const buffer = await textToSpeechUseCase(this.openai, {
      prompt: text,
      voice,
    });

    const path = await this.s3Adapter.uploadMP3(
      buffer,
      `${voice}-${Date.now()}.mp3`,
    );

    return path;
  }

  async fileGetter(fileName: string) {
    return await this.s3Adapter.getFile(fileName);
  }

  async textToSpeechGetAllFiles(): Promise<string[]> {
    return await this.s3Adapter.getAllMP3();
  }

  async speechToText(
    audioFile: Express.Multer.File,
    { prompt }: SpeechToTextDto,
  ) {
    const response = await speechToTextUseCase(this.openai, {
      audioFile,
      prompt,
    });
    //delete the file from the server
    fs.unlinkSync(audioFile.path);
    return response;
  }

  async imageGeneration(imageGeneration: ImageGenerationDto) {
    const response = await imageGenerationUseCase(this.openai, {
      ...imageGeneration,
    });

    // console.log(response);

    //save to S3
    const url = await this.s3Adapter.UploadImage(response.url);

    return {
      ok: true,
      url: url,
      revised_prompt: response.revised_prompt,
    };
  }

  async generateImageVariation(imageVariationDto: ImageVariationDto) {
    const response = await imageVariationUseCase(this.openai, {
      ...imageVariationDto,
    });

    return { ok: true, url: response.url };
  }
}
