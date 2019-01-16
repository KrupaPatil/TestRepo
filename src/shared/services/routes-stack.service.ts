import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Injectable()
export class RoutesStackService {

  constructor(private route: ActivatedRoute) {
  }

  public getUrlStack() {
    let currentRoute = this.route.root;
    let url = '';
    let urlStack = [];

    do {
      let childrenRoutes = currentRoute.children;
      currentRoute = null;
      childrenRoutes.forEach(route => {
        if (route.outlet === 'primary') {
          let routeSnapshot = route.snapshot;
          if (routeSnapshot) {
            url += _.trimEnd('/' + routeSnapshot.url.map(segment => segment.path).join('/'), '/');

            if (url && _.indexOf(urlStack, url) === -1) {
              urlStack.push(url);
            }
          }

          currentRoute = route;
        }
      })
    } while (currentRoute);

    return urlStack;
  }

  public getBackUrl(): string {
    const urlStack = this.getUrlStack();

    if (urlStack && urlStack.length > 1) {
      return urlStack[urlStack.length - 2];
    } else {
      return null;
    }
  }

}
