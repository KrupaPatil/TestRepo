import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { LayoutConfig } from './layout-config';
import { EmitterService } from './emitter.service';

@Injectable()
export class LayoutConfigHistory {

  private stack = [];
  private previousUrl: string;

  constructor(private layoutConfig: LayoutConfig,
              private location: Location,
              private emitterService: EmitterService,
              private router: Router) {
  }

  public init() {
    this.previousUrl = this.location.path();
    this._watchRouteChange();
  }

  private _watchRouteChange() {
    this.router
      .events
      .filter(event => event instanceof NavigationStart)
      .subscribe((ev) => {
          if (this._goingBack(ev['url'])) {
            this.stack.pop();
            this._restoreFromStack();
          } else if (!this._pushingToStack(ev['url'])) {
            this._resetStack();
          }

          this.previousUrl = ev['url'];
          this.emitterService.currentUrlChanged(this.previousUrl);
        }
      );
  }

  private _pushingToStack(url: string) {
    return !!this.previousUrl && url.indexOf(this.previousUrl) === 0 && url.length > this.previousUrl.length;
  }

  private _goingBack(url: string) {
    return !!this.previousUrl && this.previousUrl.indexOf(url) === 0 && url.length < this.previousUrl.length;
  }

  private _resetStack() {
    this.stack = [];
  }

  private _restoreFromStack() {
    if (this.stack.length) {
      this.layoutConfig.set(this.stack[this.stack.length - 1]);
    }
  }

  public push(config) {
    this.stack.push(config);
  }
}
