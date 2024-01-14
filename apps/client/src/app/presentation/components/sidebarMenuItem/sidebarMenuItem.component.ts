import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu-item',
  standalone: true,
  imports: [RouterModule],
  template: `
    <a
      [routerLink]="path"
      routerLinkActive="active-route bg-gradient-to-br from-[#ed091b] via-[#ef32d1] to-[#8006fb]"
      #rla="routerLinkActive"
      class="flex justify-center items-center hover:bg-gray-500 hover:bg-opacity-80 hover:cursor rounded-md p-2 transition-colors icon-style my-1"
    >
      <i class="{{ icon }} text-2xl mr-4 icon-style"></i>
      <div class="flex flex-col flex-grow">
        <span class="text-gray-600 text-lg font-semibold title-span">{{
          title
        }}</span>
        <span class="text-sm text-gray-300">{{ description }}</span>
      </div>
    </a>
  `,
  styles: [
    `
      .icon-style {
        color: #ef32d1;
      }

      .active-route .icon-style {
        color: white;
      }

      .title-span {
        color: #a0aec0;
      }

      .active-route .title-span {
        color: white;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMenuItemComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) path!: string;
}
