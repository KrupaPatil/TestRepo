import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

import { extractErrorMsg } from '../../../app/app.common';
import { UserSearchResource } from '../../../shared/resources/user-search.resource';
import { LayoutController } from '../../../shared/services/layout.controller';
import { EmitterService } from '../../../shared/services/emitter.service';

@Component({
  selector: 'user-search',
  templateUrl: 'user-search.html'
})

export class UserSearch {
  private observable;
  private searchInput;
  private showLoadMore: boolean = false;
  private loading: boolean = false;
  private ionContent;

  constructor(private layoutCtrl: LayoutController,
              private alertCtrl: AlertController,
              private emitterService: EmitterService,
              private userSearchResource: UserSearchResource) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'User Search',
      'showBackLink': true,
      'showSocialPostsGroup': false,
      'showUserSearch': false,
      'manualBackButton': false,
    });

    this.searchInput = <HTMLElement>document.querySelector('.search-input');
    this.observable = Observable.fromEvent(this.searchInput, 'input');
    this.observable
      .debounceTime(500)
      .subscribe((event)=> {
        this.userSearchResource.result.length = 0;
        this.userSearchResource.skip = 0;
        this.userSearchResource.term = event.target.value;
        if (!event.target.value.length) {
          this.userSearchResource.result.length = 0;
          this.showLoadMore = false;
        } else {
          this.userSearch();
        }
      })

    this.ionContent = <HTMLElement>document.querySelector('ion-content.page-level-1.content-ios');
    if (this.ionContent) {
      this.ionContent.style.transition = 'none';
    }

    if (window.innerWidth > 1200) {
      this.emitterService.socialDetailsScreen(false);
    }
  }

  ngAfterViewInit() {
    // timeout prevents layout issue on mobile
    setTimeout(()=> {
      this.searchInput.focus();
    }, 100)
  }

  userSearch() {
    this.loading = true;
    this.userSearchResource.userSearch().subscribe(
      (res) => {
        this.loading = false;
        this.showLoadMore = res.length == 50;
        this.userSearchResource.result = this.userSearchResource.result.concat(res);
        this.userSearchResource.skip = res.length;
      },
      (res) => {
        let alert = this.alertCtrl.create({
          title: 'Error occurred',
          subTitle: extractErrorMsg(res),
          buttons: ['OK']
        });
        alert.present();
      }
    )
  }

  ngOnDestroy() {
    this.layoutCtrl.configure({
      'pageTitle': 'Social',
      'manualBackButton': false,
      'showMenuLink': true
    });

    if (this.ionContent) {
      this.ionContent.style.transition = null;
    }
  }
}
