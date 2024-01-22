import { Injectable } from '@angular/core';
import { grammarCheckerUseCase, prosConsUseCase, prosConsStreamUseCase, translateTextUseCase} from '@core/index';
import { from } from 'rxjs';

@Injectable({providedIn: 'root'})
export class OpenAiService {
    

    grammarCheck(prompt: string){
        return from(grammarCheckerUseCase(prompt));
    }

    prosConsEvaluator(prompt: string){
        return from(prosConsUseCase(prompt));
    }
    prosConsStreamEvaluator(prompt: string, abortSignal: AbortSignal){
        return prosConsStreamUseCase(prompt, abortSignal);
    }

    translateText(prompt: string, language: string){
        return from(translateTextUseCase(prompt, language));
    }
}