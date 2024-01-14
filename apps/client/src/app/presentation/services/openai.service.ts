import { Injectable } from '@angular/core';
import { grammarCheckerUseCase } from '@core/index';
import { from } from 'rxjs';

@Injectable({providedIn: 'root'})
export class OpenAiService {
    

    grammarCheck(prompt: string){

        return from(grammarCheckerUseCase(prompt));
    }
}