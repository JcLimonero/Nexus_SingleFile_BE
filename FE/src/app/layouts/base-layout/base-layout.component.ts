import {
  AfterViewInit,
  Component,
  ContentChild,
  DestroyRef,
  inject,
  Inject,
  OnInit
} from '@angular/core';
import { AppLayoutService } from '../../core/services/app-layout.service';
import {
  MatSidenavContainer,
  MatSidenavModule
} from '@angular/material/sidenav';
import {
  Event,
  NavigationEnd,
  Router,
  RouterOutlet,
  Scroll
} from '@angular/router';
import { filter, map, startWith, withLatestFrom } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { checkRouterChildsData } from '../../core/utils/check-router-childs-data';
import { AsyncPipe, DOCUMENT, NgIf, NgTemplateOutlet } from '@angular/common';
import { LayoutConfigService } from '../../core/layout/layout-config.service';
import { AppProgressBarComponent } from '../components/app-progress-bar/app-progress-bar.component';
import { isNil } from '../../core/utils/is-nil';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppLayoutConfig } from '../../core/layout/layout-config.interface';
import { SearchComponent } from '../components/toolbar/search/search.component';

@Component({
  selector: 'vex-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss'],
  standalone: true,
  imports: [
    AppProgressBarComponent,
    SearchComponent,
    MatSidenavModule,
    NgTemplateOutlet,
    RouterOutlet,
    AsyncPipe,
    NgIf
  ]
})
export class BaseLayoutComponent implements OnInit, AfterViewInit {
  config$ = this.configService.config$;

  isFooterVisible$ = combineLatest([
    this.configService.config$.pipe(map((c) => c.footer.visible)),
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() =>
        checkRouterChildsData(
          this.router.routerState.root.snapshot,
          (data) => data.footerVisible ?? true
        )
      )
    )
  ]).pipe(
    map(([configEnabled, routeEnabled]) => {
      if (isNil(routeEnabled)) return configEnabled;
      return configEnabled && routeEnabled;
    })
  );

  sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
  isDesktop$ = this.layoutService.isDesktop$;

  scrollDisabled$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() =>
      checkRouterChildsData(
        this.router.routerState.root.snapshot,
        (data) => data.scrollDisabled ?? false
      )
    )
  );

  searchOpen$ = this.layoutService.searchOpen$;

  @ContentChild(MatSidenavContainer, { static: true })
  sidenavContainer!: MatSidenavContainer;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly layoutService: AppLayoutService,
    private readonly configService: LayoutConfigService,
    private readonly router: Router,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.isDesktop$,
      this.configService.select((c) => c.layout === 'vertical')
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([isDesktop, isVerticalLayout]) => {
        if (isDesktop && !isVerticalLayout) {
          this.layoutService.openSidenav();
        } else {
          this.layoutService.closeSidenav();
        }
      });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        withLatestFrom(this.isDesktop$),
        filter(([, isDesktop]) => !isDesktop),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.layoutService.closeSidenav());
  }

  ngAfterViewInit(): void {
    this.router.events
      .pipe(
        filter<Event, Scroll>((e: Event): e is Scroll => e instanceof Scroll),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((e) => {
        if (!this.sidenavContainer?.scrollable) return;
        if (e.position) {
          this.sidenavContainer.scrollable.scrollTo({
            start: e.position[0],
            top: e.position[1]
          });
        } else if (e.anchor) {
          const scroll = (anchor: HTMLElement) =>
            this.sidenavContainer.scrollable.scrollTo({
              behavior: 'smooth',
              top: anchor.offsetTop,
              left: anchor.offsetLeft
            });
          let anchorElem = this.document.getElementById(e.anchor);
          if (anchorElem) {
            scroll(anchorElem);
          } else {
            setTimeout(() => {
              anchorElem = e.anchor ? this.document.getElementById(e.anchor) : null;
              if (anchorElem) scroll(anchorElem);
            }, 100);
          }
        } else {
          this.sidenavContainer.scrollable.scrollTo({ top: 0, start: 0 });
        }
      });
  }
}
