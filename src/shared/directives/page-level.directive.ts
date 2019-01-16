import { Directive, ElementRef, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CONFIG_IS_MOBILE } from '@app/env';
import { RoutesStackService } from "../services/routes-stack.service";

@Directive({selector: '[pageLevel]'})
export class PageLevelDirective {
  @Input() private pageLevel: any;

  private step = 1;

  constructor(private router: Router,
              private routesStackService: RoutesStackService,
              private el: ElementRef) {
  }

  ngOnInit() {
    this._updateView();
    this._watchRouteChange();
  }

  private _updateView() {
    let currentUrlStack = this.routesStackService.getUrlStack();
    if (currentUrlStack[0]) {
      if (currentUrlStack[0].indexOf('cigar/') > -1) {
        this.step = 0;
      } else {
        this.step = 1;
      }
    }

    let currentUrlLevel = currentUrlStack ? currentUrlStack.length - this.step : 0;

    if (this.pageLevel <= currentUrlLevel) {
      // this.el.nativeElement.style.display = "block";
      this.el.nativeElement.classList.add('show');
    } else {
      // this.el.nativeElement.style.display = "none";
      this.el.nativeElement.classList.remove('show');

    }

    if (CONFIG_IS_MOBILE) {
      this.el.nativeElement.style['z-index'] = this.pageLevel * 500;
      this.el.nativeElement.style['position'] = 'absolute';
    }
  }

  private _watchRouteChange() {
      this.router
        .events
        .filter(event => event instanceof NavigationEnd)
        .subscribe(() => {
            this._updateView();
          }
        );
  }

}
