import {ViewportService} from './services/viewport.service';
import {Directive, inject} from '@angular/core';

@Directive()
export abstract class BaseComponent {
  protected readonly viewport = inject(ViewportService);
  readonly isMobile = this.viewport.isMobile;
}
