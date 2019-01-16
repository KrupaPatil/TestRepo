import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class LayoutConfig {

  public showHeader: boolean = true;
  public showMenuLink: boolean = true;
  public showBackLink: boolean = false;
  public showFooter: boolean = true;
  public showSearchProduct: boolean = true;
  public showUserSearch: boolean = false;
  public showSocialPostsGroup: boolean = false;
  public manualBackButton: boolean = false;
  public backToJournal: boolean = false;
  public clearAllNotifications: boolean = false;
  public showCreateSocialPostButton: boolean = false;
  public pageTitle: string = '';

  public displayHeader() {
    this.showHeader = true;
  }

  public hideHeader() {
    this.showHeader = false;
  }

  public updatePageTitle(title: string) {
    this.pageTitle = title;
  }

  public displayHeaderBackLink() {
    this.showBackLink = true;
    this.showMenuLink = false;
  }

  public hideHeaderBackLink() {
    this.showBackLink = false;
  }

  public displayHeaderMenuLink() {
    this.showMenuLink = true;
    this.showBackLink = false;
  }

  public hideHeaderMenuLink() {
    this.showMenuLink = false;
  }

  public displayFooter() {
    this.showFooter = true;
  }

  public hideFooter() {
    this.showFooter = false;
  }

  public get() {
    return {
      'showHeader': this.showHeader,
      'showBackLink': this.showBackLink,
      'showMenuLink': this.showMenuLink,
      'showFooter': this.showFooter,
      'pageTitle': this.pageTitle
    };
  }

  public set(config) {
    _.each(config, (value, key) => {
      if (!_.isUndefined(this[key])) {
        this[key] = value;
      }
    });
  }
}
