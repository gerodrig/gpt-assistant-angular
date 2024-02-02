import { Injectable } from '@angular/core';
import {
  grammarCheckerUseCase,
  prosConsUseCase,
  prosConsStreamUseCase,
  translateTextUseCase,
  textToSpeechUseCase,
speechToTextUseCase,
} from '@core/index';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAiService {
  grammarCheck(prompt: string) {
    return from(grammarCheckerUseCase(prompt));
  }

  prosConsEvaluator(prompt: string) {
    return from(prosConsUseCase(prompt));
  }
  prosConsStreamEvaluator(prompt: string, abortSignal: AbortSignal) {
    return prosConsStreamUseCase(prompt, abortSignal);
  }

  translateText(prompt: string, language: string) {
    return from(translateTextUseCase(prompt, language));
  }

  textToSpeech(prompt: string, voice: string) {
    return from(textToSpeechUseCase(prompt, voice));
  }

  speechToText(file: File, prompt?: string) {
    return from(speechToTextUseCase(file, prompt));
  }

  
}
