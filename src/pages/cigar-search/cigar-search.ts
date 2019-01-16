import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import 'rxjs/add/operator/filter';

import { RouterService } from '../../shared/services/router.service';

@Component({
  selector: 'page-cigar-search',
  templateUrl: 'cigar-search.html'
})
export class CigarSearchPage {
  private showCigarDetails: boolean = false;

  constructor(private router: RouterService,
              private ngRouter: Router) {
    this._watchRouteChange();
  }

  onResultClick(product) {
    this.router.navigate(['/cigar-search' + product.getDetailsUrl()]);
  }

  private _watchRouteChange() {
    this.ngRouter
      .events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((e: any) => {
          this.showCigarDetails = window.innerWidth > 1200 && e.urlAfterRedirects !== '/cigar-search';
        }
      );
  }

}
