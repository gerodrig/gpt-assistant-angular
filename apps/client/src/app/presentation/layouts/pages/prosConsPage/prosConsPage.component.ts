import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Message } from '@interfaces/message.interface';
import {
  GptMessageComponent,
  MyMessageComponent,
  TypingLoaderComponent,
  TextMessageBoxComponent,
  TextMessageBoxFileComponent,
  TextMessageBoxSelectComponent,
} from '@presentation/components';
import { OpenAiService } from '@presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './prosConsPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    //?set loader
    this.isLoading.set(true);

    this.messages.update((messages) => [
      ...messages,
      {
        isGpt: false,
        text: prompt,
      },
    ]);

    this.openAiService.prosConsEvaluator(prompt).subscribe((response) => {
      if (response.ok) {
        this.messages.update((messages) => [
          ...messages,
          {
            isGpt: true,
            text: 'The pros and cons are as follows: ' + response.message,
          },
        ]);
      } else {
        this.messages.update((messages) => [
          ...messages,
          {
            isGpt: true,
            text: 'Sorry, pros and cons evaluation failed.',
          },
        ]);
      }
      this.isLoading.set(false);
    });
  }
}
