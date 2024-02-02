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
  TextMessageBoxFileComponent,
  TextMessageEvent,
} from '@presentation/components';
import { OpenAiService } from '@presentation/services/openai.service';
import { SpeechToTextResponse } from '../../../../interfaces/speech-to-text.response';

@Component({
  selector: 'app-audio-to-text-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxFileComponent,
  ],
  templateUrl: './speechToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class speechToTextPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);

  handleMessageWithFile({ prompt, file }: TextMessageEvent) {
    const text = prompt ?? file.name ?? 'Transcribe audio file';
    this.isLoading.set(true);

    this.messages.update((messages) => [
      ...messages,
      {
        text,
        isGpt: false,
      },
    ]);

    this.openAiService.speechToText(file, text).subscribe((response) => this.handleResponse(response));
  }

  handleResponse(response: SpeechToTextResponse | null) {
    this.isLoading.set(false);

    if (!response) return;

    const text = `## Transcription: 
__Duration:__ ${Math.round(response.duration)} seconds

## Transcription:
${response.text}
    `;

    this.messages.update((messages) => [
      ...messages,
      {
        text,
        isGpt: true,
      },
    ]);

    //get the segments
//     for (const segment of response.segments) {
//       const segmentMessage = `
// __From ${Math.round(segment.start)} to ${Math.round(segment.end)} seconds:__
// ${segment.text}
//       `;

//       this.messages.update((messages) => [
//         ...messages,
//         {
//           text: segmentMessage,
//           isGpt: true,
//         },
//       ]);
//     }
  }
}
