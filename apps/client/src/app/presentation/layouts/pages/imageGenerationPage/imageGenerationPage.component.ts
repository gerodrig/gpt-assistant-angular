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
  TextMessageEvent,
  TextMessageBoxEvent,
} from '@presentation/components';
import { OpenAiService } from '@presentation/services/openai.service';

@Component({
  selector: 'app-image-generation-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './imageGenerationPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageGenerationPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    this.isLoading.set(true);

    this.messages.update((prev) => [...prev, { text: prompt, isGpt: false }]);

    this.openAiService.imageGeneration(prompt).subscribe((response) => {
      this.isLoading.set(false);
      if (!response) return;

      this.messages.update((prev) => [
        ...prev,
        {
          text: response.alt,
          isGpt: true,
          imageInfo: response,
        },
      ]);
    });
  }
}
