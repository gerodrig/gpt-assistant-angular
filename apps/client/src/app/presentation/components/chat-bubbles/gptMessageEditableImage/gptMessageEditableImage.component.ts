import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-gpt-message-editable-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gptMessageEditableImage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptMessageEditableImageComponent implements AfterViewInit {
  @Input({ required: true }) text!: string;
  @Input({ required: true }) imageInfo!: { url: string; alt: string };
  @ViewChild('canvas') canvasElement?: ElementRef<HTMLCanvasElement>;

  @Output() onSelectedImage = new EventEmitter<string>();

  public originalImage = signal<HTMLImageElement | null>(null);
  public isDrawing = signal<boolean>(false);
  public coords = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  ngAfterViewInit(): void {
    if (!this.canvasElement?.nativeElement) return;

    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = this.imageInfo.url;

    this.originalImage.set(image);

    image.onload = () => {
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }

  onMouseDown(event: MouseEvent) {
    if(!this.canvasElement?.nativeElement) return;
            
    this.isDrawing.set(true);
    
    //Get the coordinates of the mouse relative to the canvas
    const startX = event.clientX - this.canvasElement.nativeElement.getBoundingClientRect().left;
    const startY = event.clientY - this.canvasElement.nativeElement.getBoundingClientRect().top;

    //? Set the coordinates of the mouse relative to the canvas
    this.coords.set({ x: startX, y: startY });
  }

  onMouseMove(event: MouseEvent) {
    if(!this.isDrawing()) return;
    if(!this.canvasElement?.nativeElement) return;

    const canvasRef = this.canvasElement.nativeElement;

    const currentX = event.clientX - canvasRef.getBoundingClientRect().left;
    const currentY = event.clientY - canvasRef.getBoundingClientRect().top;

    //? Calculate height and width of the rectangle
    const width = currentX - this.coords().x;
    const height = currentY - this.coords().y;

    //? Get canvas size
    const canvasWidth = canvasRef.width;
    const canvasHeight = canvasRef.height;

    //? Clear the canvas
    const ctx = canvasRef.getContext('2d');
    ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx?.drawImage(this.originalImage()!, 0, 0, canvasWidth, canvasHeight);


    // ctx?.fillRect(this.coords().x, this.coords().y, width, height);
    ctx?.clearRect(this.coords().x, this.coords().y, width, height);

  }

  onMouseUp() {
    this.isDrawing.set(false);

    const canvas = this.canvasElement?.nativeElement;

    const url = canvas?.toDataURL('image/png');

    this.onSelectedImage.emit(url!);
  }

  handleClick() {
    this.onSelectedImage.emit(this.imageInfo.url);
  }
}
