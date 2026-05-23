import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  NavigationItem,
  NavigationLink
} from '../../../../core/navigation/navigation-item.interface';
import { filter, map, shareReplay, startWith } from 'rxjs/operators';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NavigationService } from '../../../../core/navigation/navigation.service';
import { trackByRoute } from '@vex/utils/track-by';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
  NgTemplateOutlet
} from '@angular/common';

@Component({
  selector: 'vex-navigation-item',
  templateUrl: './navigation-item.component.html',
  styleUrls: ['./navigation-item.component.scss'],
  // OnPush — antes evaluaba `(isActive$ | async)?.(item)` en cada CD tick
  // (~10+ nodos por menú × varios CD ticks/segundo = recursión costosa).
  // Con OnPush sólo recalcula cuando @Input cambia o emite isActive$.
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MatRippleModule,
    NgClass,
    RouterLink,
    MatMenuModule,
    NgFor,
    MatIconModule,
    NgTemplateOutlet,
    AsyncPipe
  ]
})
export class NavigationItemComponent implements OnInit {
  @Input({ required: true }) item!: NavigationItem;

  /**
   * Cache memoized de hasActiveChilds. Antes la función se invocaba decenas
   * de veces por CD tick (10+ nodos en el template × recursión por nivel).
   * Con WeakMap el resultado se calcula una sola vez por item por
   * NavigationEnd. Se resetea cuando emite el observable.
   */
  private activeCache = new WeakMap<NavigationItem, boolean>();

  isActive$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() => {
      // Invalidar cache en cada cambio de ruta — los hits cambian con la URL
      this.activeCache = new WeakMap();
      return (item: NavigationItem) => this.hasActiveChilds(item);
    }),
    // shareReplay evita re-suscripciones múltiples del async pipe (un mismo
    // observable se referencia desde decenas de bindings en el template).
    shareReplay({ bufferSize: 1, refCount: true })
  );

  isLink = this.navigationService.isLink;
  isDropdown = this.navigationService.isDropdown;
  isSubheading = this.navigationService.isSubheading;
  trackByRoute = trackByRoute;

  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {}

  trackByLabel = (_: number, item: { label?: string }): string => item?.label ?? '';

  ngOnInit() {}

  hasActiveChilds(parent: NavigationItem): boolean {
    // Hit en cache: la respuesta no cambia hasta el próximo NavigationEnd
    const cached = this.activeCache.get(parent);
    if (cached !== undefined) {
      return cached;
    }

    let result = false;
    if (this.isLink(parent)) {
      result = this.router.isActive(parent.route as string, true);
    } else if (this.isDropdown(parent) || this.isSubheading(parent)) {
      result = parent.children.some((child) => {
        if (this.isDropdown(child)) {
          return this.hasActiveChilds(child);
        }
        if (this.isLink(child) && !this.isFunction(child.route)) {
          return this.router.isActive(child.route as string, true);
        }
        return false;
      });
    }

    this.activeCache.set(parent, result);
    return result;
  }

  isFunction(prop: NavigationLink['route']) {
    return prop instanceof Function;
  }
}
