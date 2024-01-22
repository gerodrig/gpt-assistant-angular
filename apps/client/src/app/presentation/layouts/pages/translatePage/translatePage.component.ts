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
  TextMessageBoxEvent,
} from '@presentation/components';
import { OpenAiService } from '@presentation/services/openai.service';

@Component({
  selector: 'app-translate-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    // TextMessageBoxComponent,
    // TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './translatePage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TranslatePageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);
  public languages = signal<{ id: string; name: string }[]>([
    { id: 'german', name: 'German' },
    { id: 'french', name: 'French' },
    { id: 'spanish', name: 'Spanish' },
    { id: 'italian', name: 'Italian' },
    { id: 'portuguese', name: 'Portuguese' },
    { id: 'russian', name: 'Russian' },
    { id: 'chinese', name: 'Chinese' },
    { id: 'korean', name: 'Korean' },
    { id: 'arabic', name: 'Arabic' },
    { id: 'hindi', name: 'Hindi' },
  ]);

  handleMessageWithSelect(event: TextMessageBoxEvent) {
    this.isLoading.set(true);

    this.messages.update((messages) => [
      ...messages,
      {
        isGpt: false,
        text: event.prompt,
      },
    ]);

    const { prompt, selectedOption } = event;

    this.openAiService
      .translateText(prompt, selectedOption)
      .subscribe((response) => {
        if (response.ok) {
          this.messages.update((messages) => [
            ...messages,
            {
              isGpt: true,
              text: 'The translation is as follows: ' + response.message,
            },
          ]);
        } else {
          this.messages.update((messages) => [
            ...messages,
            {
              isGpt: true,
              text: 'Sorry, translation failed.',
            },
          ]);
        }
        this.isLoading.set(false);
      });
  }
}
