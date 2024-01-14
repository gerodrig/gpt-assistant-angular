import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

export type TextMessageEvent = {
  prompt?: string | null;
  file: File;
}

@Component({
  selector: 'app-text-message-box-file',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './textMessageBoxFile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxFileComponent {
  @Input() public placeholder: string = '';
  @Output() public onMessage = new EventEmitter<TextMessageEvent>();

  public fb = inject(FormBuilder);
  public form = this.fb.group({
    prompt: [],
    file: [null, Validators.required],
  });
  public file: File | undefined = undefined;

  handleSelectedFile(event: any) {
    const file = event.target.files.item(0);
    this.form.controls.file.setValue(file);
  }

  handleSubmit() {
    if (this.form.invalid) return;

    const { prompt = '', file } = this.form.value;

    this.onMessage.emit({ prompt, file: file! });
    this.form.reset();
  }
}
