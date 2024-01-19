import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  MyMessageComponent,
  GptMessageComponent,
  TypingLoaderComponent,
  TextMessageBoxComponent,
} from '@components/index';
import type { Message } from '@interfaces/index';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-grammar-checker-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './grammarCheckerPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GrammarCheckerPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    //? Set loader
    this.isLoading.set(true);

    this.messages.update((messages) => [
      ...messages,
      {
        isGpt: false,
        text: prompt,
      }
    ]);

    this.openAiService.grammarCheck(prompt).subscribe((response) => {
      if (response.ok) {
        this.messages.update((messages) => [
          ...messages,
          {
            isGpt: true,
            text: 'The correction is as follows: ' + response.message,
          }
        ]);
      } else {
        this.messages.update((messages) => [
          ...messages,
          {
            isGpt: true,
            text: 'Sorry, grammar check failed.'
          }
        ]);
      }
      this.isLoading.set(false);

    });


  }
}
