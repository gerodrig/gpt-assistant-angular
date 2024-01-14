import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  MyMessageComponent,
  GptMessageComponent,
  TypingLoaderComponent,
  TextMessageBoxComponent,
TextMessageEvent,
TextMessageBoxEvent,
TextMessageBoxFileComponent,
TextMessageBoxSelectComponent,
} from '@components/index';
import type { Message } from '@interfaces/index';
import { OpenAiService } from '@presentation/services/openai.service';

@Component({
  selector: 'app-grammar-checker-page',
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
  templateUrl: './chatTemplate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatTemplateComponent {
  public messages = signal<Message[]>([
    {
      text: 'Hello Geppeto',
      isGpt: false,
    },
  ]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    console.log({ prompt });
  }

  handleMessageWithFile({prompt, file}: TextMessageEvent){
    console.log({prompt, file});
  }

  handleMessageWithSelect(event: TextMessageBoxEvent) {
    console.log(event);
  }
}
