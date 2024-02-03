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
} from '@presentation/components';
import { OpenAiService } from '@presentation/services/openai.service';
import { GptMessageEditableImageComponent } from '../../../components/chat-bubbles/gptMessageEditableImage/gptMessageEditableImage.component';

@Component({
  selector: 'app-image-tuning-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    GptMessageEditableImageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './imageTuningPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTuningPageComponent {
  public messages = signal<Message[]>([
    // {
    //   isGpt: true,
    //   text: 'Dummy Image',
    //   imageInfo: {
    //     alt: 'Image',
    //     url: 'https://gerodrig-gpt-assistant.s3.us-east-1.amazonaws.com/images/1706943287341.png',
    //   },
    // },
  ]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);
  public originalImage = signal<string | undefined>(undefined);
  public maskImage = signal<string | undefined>(undefined);

  handleMessage(prompt: string) {
    this.isLoading.set(true);
    this.messages.update((messages) => [
      ...messages,
      { isGpt: false, text: prompt },
    ]);

    this.openAiService
      .imageGeneration(prompt, this.originalImage(), this.maskImage())
      .subscribe((response) => {
        this.isLoading.set(false);
        if (!response) return;

        this.messages.update((messages) => [
          ...messages,
          {
            isGpt: true,
            text: response.alt,
            imageInfo: response,
          },
        ]);
      });
  }

  handleImageChange(newImage: string, originalImage: string) {
    this.originalImage.set(originalImage);
    this.maskImage.set(newImage);
  }

  generateVariation() {
    if (!this.originalImage()) return;

    this.isLoading.set(true);

    this.openAiService
      .imageVariation(this.originalImage()!)
      .subscribe((response) => {
        this.isLoading.set(false);

        if (!response) return;

        this.messages.update((messages) => [
          ...messages,
          {
            isGpt: true,
            text: 'Generated Image',
            imageInfo: response,
          },
        ]);
      });
  }
}
