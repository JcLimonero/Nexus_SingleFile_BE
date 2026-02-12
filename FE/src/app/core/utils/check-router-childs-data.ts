import { ActivatedRouteSnapshot } from '@angular/router';

export interface RouteDataWithLayout {
  toolbarShadowEnabled?: boolean;
  footerVisible?: boolean;
  scrollDisabled?: boolean;
  [key: string]: unknown;
}

export function checkRouterChildsData(
  route: ActivatedRouteSnapshot & { data?: RouteDataWithLayout },
  compareWith: (data: RouteDataWithLayout) => boolean
): boolean {
  if (route.data && compareWith(route.data)) {
    return true;
  }
  if (!route.firstChild) {
    return false;
  }
  return checkRouterChildsData(route.firstChild, compareWith);
}
