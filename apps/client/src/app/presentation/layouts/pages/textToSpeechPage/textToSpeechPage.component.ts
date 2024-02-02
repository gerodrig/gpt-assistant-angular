import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Message } from '@interfaces/index';
import {
  GptMessageComponent,
  MyMessageComponent,
  TypingLoaderComponent,
  TextMessageBoxSelectComponent,
  TextMessageBoxEvent,
} from '@presentation/components';
import { OpenAiService } from '@presentation/services/openai.service';

@Component({
  selector: 'app-text-to-audio-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './textToSpeechPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToSpeechPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);

  public voices = signal([
    { id: 'nova', name: 'Nova' },
    { id: 'alloy', name: 'Alloy' },
    { id: 'echo', name: 'Echo' },
    { id: 'fable', name: 'Fable' },
    { id: 'onyx', name: 'Onyx' },
    { id: 'shimmer', name: 'Shimmer' },
  ]);

  handleMessageWithSelect({ prompt, selectedOption }: TextMessageBoxEvent) {
    const message = `${selectedOption} - ${prompt}`;

    this.messages.update((messages) => [
      ...messages,
      {
        text: message,
        isGpt: false,
      },
    ]);

    this.isLoading.set(true);

    this.openAiService
      .textToSpeech(prompt, selectedOption)
      .subscribe(({ ok, message, audioUrl }) => {
        this.isLoading.set(false);
        if(ok){
          this.messages.update((messages) => [
            ...messages,
            {
              text: message,
              isGpt: true,
              audioUrl,
            },
          ]);
        } else {
          this.messages.update((messages) => [
            ...messages,
            {
              text: message,
              isGpt: true,
            },
          ]);
        }
          
      });
  }
}
