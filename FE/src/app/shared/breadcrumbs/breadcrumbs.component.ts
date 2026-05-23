import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      *ngIf="(crumbs$ | async)?.length"
      class="breadcrumbs"
      aria-label="Ruta de navegación"
    >
      <ol class="breadcrumbs__list">
        <li
          *ngFor="let crumb of (crumbs$ | async); let last = last; trackBy: trackByUrl"
          class="breadcrumbs__item"
        >
          <a
            *ngIf="!last"
            [routerLink]="crumb.url"
            class="breadcrumbs__link"
          >{{ crumb.label }}</a>
          <span
            *ngIf="last"
            aria-current="page"
            class="breadcrumbs__current"
          >{{ crumb.label }}</span>
          <mat-icon
            *ngIf="!last"
            svgIcon="mat:chevron_right"
            class="breadcrumbs__sep"
            aria-hidden="true"
          ></mat-icon>
        </li>
      </ol>
    </nav>
  `,
  styles: [
    `
      .breadcrumbs__list {
        display: flex;
        align-items: center;
        gap: 4px;
        list-style: none;
        margin: 0;
        padding: 8px 16px;
        font-size: 0.875rem;
        color: rgb(75 85 99);
      }
      .breadcrumbs__item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .breadcrumbs__link {
        color: rgb(75 85 99);
        text-decoration: none;
      }
      .breadcrumbs__link:hover {
        text-decoration: underline;
      }
      .breadcrumbs__current {
        font-weight: 600;
        color: rgb(31 41 55);
      }
      .breadcrumbs__sep {
        width: 16px;
        height: 16px;
        font-size: 16px;
        opacity: 0.5;
      }
    `
  ]
})
export class BreadcrumbsComponent implements OnInit {
  crumbs$!: Observable<Breadcrumb[]>;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.crumbs$ = this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.buildCrumbs(this.route.root))
    );
  }

  private buildCrumbs(
    route: ActivatedRoute,
    url = '',
    crumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children = route.children;
    for (const child of children) {
      const segment = child.snapshot.url.map((s) => s.path).join('/');
      const nextUrl = segment ? `${url}/${segment}` : url;
      const label = child.snapshot.data?.['breadcrumb'];
      if (label) {
        crumbs.push({ label, url: nextUrl || '/' });
      }
      this.buildCrumbs(child, nextUrl, crumbs);
    }
    return crumbs;
  }

  trackByUrl = (_: number, c: Breadcrumb) => c.url;
}
