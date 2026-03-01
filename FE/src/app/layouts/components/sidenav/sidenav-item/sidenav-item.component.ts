import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  NavigationDropdown,
  NavigationItem,
  NavigationLink
} from '../../../../core/navigation/navigation-item.interface';
import { dropdownAnimation } from '@vex/animations/dropdown.animation';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavigationService } from '../../../../core/navigation/navigation.service';

import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vex-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss'],
  animations: [dropdownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MatRippleModule,
    RouterLinkActive,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    NgClass,
    NgFor
  ]
})
export class SidenavItemComponent implements OnInit, OnChanges {
  @Input({ required: true }) item!: NavigationItem;
  @Input({ required: true }) level!: number;
  @Input() collapsed = false;
  isOpen: boolean = false;
  isActive: boolean = false;

  isLink = this.navigationService.isLink;
  isDropdown = this.navigationService.isDropdown;
  isSubheading = this.navigationService.isSubheading;

  flyoutTop: string = 'auto';
  flyoutBottom: string = 'auto';

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly el: ElementRef = inject(ElementRef);

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private navigationService: NavigationService
  ) {}

  @HostBinding('class')
  get levelClass() {
    return `item-level-${this.level}`;
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        filter(() => this.isDropdown(this.item)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.onRouteChange());

    this.navigationService.openChange$
      .pipe(
        filter(() => this.isDropdown(this.item)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((item) => this.onOpenChange(item));

    this.navigationService.closeAll$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.isOpen) {
          this.isOpen = false;
          this.cd.markForCheck();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      changes.hasOwnProperty('item') &&
      this.isDropdown(this.item)
    ) {
      this.onRouteChange();
    }
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;

    if (this.isOpen && this.level === 0) {
      const rect = this.el.nativeElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const childCount = (this.item as NavigationDropdown).children?.length || 0;
      // Estimate flyout height: each item ~44px + 22px padding
      const estimatedHeight = childCount * 44 + 22;
      const spaceBelow = viewportHeight - rect.top;

      if (estimatedHeight <= spaceBelow) {
        // Fits below: align top with the item
        this.flyoutTop = rect.top + 'px';
        this.flyoutBottom = 'auto';
      } else {
        // Doesn't fit: anchor to bottom of viewport with margin
        this.flyoutTop = 'auto';
        this.flyoutBottom = '12px';
      }
    }

    this.navigationService.triggerOpenChange(this.item as NavigationDropdown);
    this.cd.markForCheck();
  }

  onLinkClick() {
    this.navigationService.triggerCloseAll();
  }

  onOpenChange(item: NavigationDropdown) {
    if (this.isChildrenOf(this.item as NavigationDropdown, item)) {
      return;
    }

    if (this.hasActiveChilds(this.item as NavigationDropdown)) {
      return;
    }

    if (this.item !== item) {
      this.isOpen = false;
      this.cd.markForCheck();
    }
  }

  onRouteChange() {
    if (this.hasActiveChilds(this.item as NavigationDropdown)) {
      this.isActive = true;
      // Don't auto-open dropdowns in collapsed icon-bar mode
      this.cd.markForCheck();
    } else {
      this.isActive = false;
      this.isOpen = false;
      this.cd.markForCheck();
    }
  }

  isChildrenOf(parent: NavigationDropdown, item: NavigationDropdown): boolean {
    if (parent.children.indexOf(item) !== -1) {
      return true;
    }

    return parent.children
      .filter((child) => this.isDropdown(child))
      .some((child) => this.isChildrenOf(child as NavigationDropdown, item));
  }

  hasActiveChilds(parent: NavigationDropdown): boolean {
    return parent.children.some((child) => {
      if (this.isDropdown(child)) {
        return this.hasActiveChilds(child);
      }

      if (this.isLink(child) && !this.isFunction(child.route)) {
        return this.router.isActive(child.route as string, false);
      }
    });
  }

  isFunction(prop: NavigationLink['route']): boolean {
    return prop instanceof Function;
  }
}
