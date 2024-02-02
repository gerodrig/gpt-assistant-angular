import { OpenAI } from 'openai';
import { Voice } from '../../interfaces';

type Options = {
  prompt: string;
  voice: Voice;
};

export const textToSpeechUseCase = async (
  openai: OpenAI,
  { prompt, voice }: Options,
): Promise<Buffer> => {
  const voices: Record<Voice, Voice> = {
    alloy: 'alloy',
    echo: 'echo',
    fable: 'fable',
    onyx: 'onyx',
    nova: 'nova',
    shimmer: 'shimmer',
  } as const;

  const selectedVoice = voices[voice.toLocaleLowerCase()] ?? 'nova';

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  return Buffer.from(await mp3.arrayBuffer());
};
