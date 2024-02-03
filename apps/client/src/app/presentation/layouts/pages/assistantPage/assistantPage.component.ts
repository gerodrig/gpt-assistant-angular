import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { Message } from '@interfaces/message.interface';
import {
  GptMessageComponent,
  MyMessageComponent,
  TypingLoaderComponent,
  TextMessageBoxComponent,
  TextMessageEvent,
  TextMessageBoxEvent,
} from '@presentation/components';
import { OpenAiService } from '@presentation/services/openai.service';

@Component({
  selector: 'app-assistant-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './assistantPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AssistantPageComponent implements OnInit {
  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);
  public threadId = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.openAiService.createThread().subscribe((id) => {
      this.threadId.set(id);
    });
  }

  handleMessage(question: string) {
    this.isLoading.set(true);

    this.messages.update((messages) => [
      ...messages,
      { text: question, isGpt: false },
    ]);

    this.openAiService
      .postQuestion(this.threadId()!, question)
      .subscribe((replies) => {
        this.isLoading.set(false);

        for (const reply of replies) {
          for (const message of reply.content) {
            this.messages.update((messages) => [
              ...messages,
              { text: message, isGpt: reply.role === 'assistant' },
            ]);
          }
        }
      });
  }
}
