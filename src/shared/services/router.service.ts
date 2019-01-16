import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable()
export class RouterService {

  private latestParams = {};

  constructor(private router: Router) {
  }

  public navigate(commands: any[], extras?: NavigationExtras) {
    return this.router.navigate(commands, extras);
  }

  public navigateWithParams(commands: any[], params?: {}, extras?: NavigationExtras) {
    this.latestParams = params;
    return this.router.navigate(commands, extras);
  }

  public navigateByUrl(url: string, extras?: NavigationExtras) {
    return this.router.navigateByUrl(url, extras);
  }

  public navigateToRoot() {
    return this.router.navigate(['/my-cigars']);
  }

  public getParam(param) {
    return this.latestParams[param];
  }

  public getParams() {
    return this.latestParams;
  }

  public getEvents() {
    return this.router.events;
  }

}
