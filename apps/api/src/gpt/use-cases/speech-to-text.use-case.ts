import * as fs from 'fs';
import type OpenAI from 'openai';

type Options = {
  prompt?: string;
  audioFile: Express.Multer.File;
};

export const speechToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, audioFile } = options;

  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt: prompt,
    response_format: 'verbose_json',
  });

  return response;
};
