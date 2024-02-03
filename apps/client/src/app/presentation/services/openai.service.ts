import { Injectable } from '@angular/core';
import {
  grammarCheckerUseCase,
  prosConsUseCase,
  prosConsStreamUseCase,
  translateTextUseCase,
  textToSpeechUseCase,
  speechToTextUseCase,
  imageGenerationUseCase,
  createThreadUseCase,
  postQuestionUseCase,
} from '@core/index';
import { Observable, from, of, tap } from 'rxjs';
import { imageVariationUseCase } from '../../core/use-cases/image-generation/image-variation.use-case';

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

  imageGeneration(prompt: string, originalImage?: string, maskImage?: string) {
    return from(imageGenerationUseCase({ prompt, originalImage, maskImage }));
  }

  imageVariation(originalImage: string) {
    return from(imageVariationUseCase(originalImage));
  }

  createThread(): Observable<string> {
    if (localStorage.getItem('thread')) {
      return of(localStorage.getItem('thread')!);
    }

    return from(createThreadUseCase()).pipe(
      tap((thread: string) => {
        localStorage.setItem('thread', thread);
      }),
    );
  }

  postQuestion(threadId: string, question: string) {
    return from(postQuestionUseCase(threadId, question));
  }
}
