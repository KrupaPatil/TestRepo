import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Platform } from "ionic-angular";
import { Location } from '@angular/common';

@Injectable()
export class BackNavigationService {

  private navigationStack = ['/'];

  constructor(private router: Router,
              private platform: Platform,
              private location: Location) {
  }

  init() {
    if (this.platform.is('android')) {
    this.platform.registerBackButtonAction(() => {
      if (this.navigationStack[(this.navigationStack.length - 2)] !== '/') {
        this.location.back();
      }
    });

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((e: any) => {
        if (this.navigationStack[(this.navigationStack.length - 2)] == e.url) {
          this.navigationStack.pop();
        } else {
          this.navigationStack.push(e.url);
        }
      });
    }
  }
}
