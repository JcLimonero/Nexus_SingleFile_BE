import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy
} from '@angular/core';
import SimpleBar from 'simplebar';

@Component({
  selector: 'app-scrollbar',
  template: '<ng-content></ng-content>',
  host: { class: 'app-scrollbar' },
  standalone: true
})
export class AppScrollbarComponent implements AfterContentInit, OnDestroy {
  @Input() options?: Partial<Record<string, unknown>>;
  scrollbarRef?: SimpleBar;

  constructor(
    private element: ElementRef,
    private zone: NgZone
  ) {}

  ngAfterContentInit(): void {
    this.zone.runOutsideAngular(() => {
      this.scrollbarRef = new SimpleBar(
        this.element.nativeElement,
        this.options
      );
    });
  }

  ngOnDestroy(): void {
    if (this.scrollbarRef && (this.scrollbarRef as unknown as { unMount?: () => void }).unMount) {
      (this.scrollbarRef as unknown as { unMount: () => void }).unMount();
    }
  }
}
