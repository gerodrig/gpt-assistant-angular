import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-image-tuning-page',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './imageTuningPage.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTuningPageComponent { }
