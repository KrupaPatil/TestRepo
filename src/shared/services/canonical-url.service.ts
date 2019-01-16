import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable()
export class CanonicalUrlService {

  private canonicals: HTMLElement[] = [];

  constructor(private router: Router) {
  }

  init() {
    this.router.events
      .filter(event => (event instanceof NavigationEnd))
      .subscribe(() => {
        this._removeExistingCanonicals();
      });
  }

  public set(canonicalUrl) {
    this._removeExistingCanonicals();

    let canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', canonicalUrl);

    this.canonicals.push(canonical);

    document.head.appendChild(canonical);
  }

  private _removeExistingCanonicals() {
    this.canonicals.forEach((item) => {
      document.head.removeChild(item);
    });

    this.canonicals = [];
  }

}
