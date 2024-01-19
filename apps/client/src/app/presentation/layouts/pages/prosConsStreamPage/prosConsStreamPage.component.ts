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
  selector: 'app-pros-const-stream-page',
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
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);

  public abortSignal = new AbortController();
  public isStreaming = signal<boolean>(false);

  async handleMessage(prompt: string) {
    //? Set abort signal
    this.abortSignal.abort();

    this.abortSignal = new AbortController();

    //? Set streaming
    this.isStreaming.set(true);

    //? Set loader
    this.isLoading.set(true);

    //? Add prompt to messages
    this.messages.update((messages) => [
      ...messages,
      {
        isGpt: false,
        text: prompt,
      },
      {
        isGpt: true,
        text: '...',
      },
    ]);

    const stream = this.openAiService.prosConsStreamEvaluator(prompt, this.abortSignal.signal);
    this.isLoading.set(false);

    for await (const text of stream) {
      this.handleStreamResponse(text);
    }
  }

  handleStreamResponse(message: string) {
    this.messages().pop();
    const messages = this.messages();

    this.messages.set([...messages, { isGpt: true, text: message }]);
  }

    handleStopStreaming() {
        console.log('stop streaming');
        this.isStreaming.set(false);
        this.abortSignal.abort();
    }
}
