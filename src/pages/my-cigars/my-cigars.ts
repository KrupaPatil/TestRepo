import 'rxjs/add/observable/forkJoin';

import { Component, Injector } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ProductModel } from 'shared/models/product.model';

import { extractErrorMsg } from '../../app/app.common';
import { FavoritesData } from '../../shared/data/favorites.data';
import { JournalData } from '../../shared/data/journal.data';
import { WishListData } from '../../shared/data/wish-list.data';
import { FAVORITES_LIST, FavoritesItemModel } from '../../shared/models/favorites-item.model';
import { JOURNAL_LIST, JournalItemModel } from '../../shared/models/journal-item.model';
import { SurveyModel } from '../../shared/models/survey.model';
import { UserDataSummaryModel } from '../../shared/models/user-data-summary.model';
import { WISH_LIST, WishListItemModel } from '../../shared/models/wish-list-item.model';
import { NotificationResource } from '../../shared/resources/notification.resource';
import { UserDataSummaryResource } from '../../shared/resources/user-data-summary.resource';
import { CigarListActionsService } from '../../shared/services/cigar-list-actions.service';
import { EmitterService } from '../../shared/services/emitter.service';
import { LayoutController } from '../../shared/services/layout.controller';
import { RouterService } from '../../shared/services/router.service';
import { StorageService } from '../../shared/services/storage.service';
import { SurveyService } from '../../shared/services/survey.service';

export const DATE_SORT_FIELD = 'Date';
export const NAME_SORT_FIELD = 'Product.Name';
export const RATING_SORT_FIELD = 'Product.RatingSummary.AverageRating';
export const MY_RATING_SORT_FIELD = 'Product.MyRating.Rating';


const DEFAULT_TAKE = 100;

@Component({
  selector: 'my-cigars',
  templateUrl: 'my-cigars.html'
})
export class MyCigarsPage {

  list: string = 'myJournal';
  showCigarDetails: boolean = false;
  idOfCurrentCigarViewed: number;
  lastCigar: ProductModel;

  cigarsSummary = {
    myJournal: null,
    favorites: null,
    wishList: null
  };

  isTablet = false;
  showSurvey = false;
  survey: SurveyModel[] = [];

  segmentKeys = [
    'myJournal',
    'favorites',
    'wishList'
  ];
  dateSortField = DATE_SORT_FIELD;
  nameSortField = NAME_SORT_FIELD;
  ratingSortField = RATING_SORT_FIELD;
  myRatingSortField = MY_RATING_SORT_FIELD;

  segments = {
    'myJournal': {
      'name': 'My Journal',
      'list': JOURNAL_LIST,
      'resource': null,
      'models': null,
      'sort': DATE_SORT_FIELD,
      'ascending': false,
      'total': DEFAULT_TAKE
    },
    'favorites': {
      'name': 'Favorites',
      'list': FAVORITES_LIST,
      'resource': null,
      'models': null,
      'sort': DATE_SORT_FIELD,
      'ascending': false,
      'total': DEFAULT_TAKE
    },
    'wishList': {
      'name': 'Wish List',
      'list': WISH_LIST,
      'resource': null,
      'models': null,
      'sort': DATE_SORT_FIELD,
      'ascending': false,
      'total': DEFAULT_TAKE
    }
  };

  constructor(private alertCtrl: AlertController,
              private layoutCtrl: LayoutController,
              private router: RouterService,
              private cigarListActions: CigarListActionsService,
              private emitterService: EmitterService,
              private storageService: StorageService,
              private userDataSummaryResource: UserDataSummaryResource,
              private surveyService: SurveyService,
              private platform: Platform,
              private injector: Injector) {
  }

  ngOnInit() {
    this.segments['myJournal']['resource'] = this.injector.get(JournalData);
    this.segments['favorites']['resource'] = this.injector.get(FavoritesData);
    this.segments['wishList']['resource'] = this.injector.get(WishListData);
    this.getSortedList();

    this.layoutCtrl.configure({
      'pageTitle': 'My Cigars',
      'showMenuLink': true,
      'showBackLink': false,
      'showHeader': true,
      'showFooter': true
    });

    if (this.platform.is('tablet')) {
      this.isTablet = true;
    }

    this.emitterService.detailsScreenStatus.subscribe((screenStatus: boolean) => {
      this.closeDetails();
    });

    this.emitterService.detailsWhenLineStatus.subscribe((whenLineStatus: boolean) => {
      setTimeout(() => {
        this.showCigarDetails = true;
      })
    });

    if (window.innerWidth < 1200) {
      this.surveyService.getSurveys().subscribe(
        (survey: SurveyModel[]) => {
          this.showSurvey = true;
          this.survey = survey;
        },
        (res) => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(res),
            buttons: ['OK']
          });
          alert.present();
        }
      );
    }

    this.updateUserListData();

    this.userDataSummaryResource.listingSummaryUpdated.subscribe((dataSummary: any) => {
      this.cigarsSummary = dataSummary;
    });
  }

  updateUserListData() {
    this.userDataSummaryResource.getUserDataSummary()
      .subscribe(
        (res: UserDataSummaryModel) => {
          this.cigarsSummary = {
            myJournal: res.CigarsInJournal,
            favorites: res.CigarsInFavorites,
            wishList: res.CigarsInWishlist
          };
          this.userDataSummaryResource.listingsSummary = this.cigarsSummary;
        },
        (err) => {
        }
      )
  }

  getCigars(sort, ascending, take, skip, append = false) {
    this.segments[this.list]['resource'].getList(sort, ascending, take, skip)
      .subscribe(
        (cigars: [JournalItemModel | FavoritesItemModel | WishListItemModel]) => {
          if (append) {
            this.segments[this.list]['models'] =
              this.segments[this.list]['models'].concat(cigars);
          } else {
            this.segments[this.list]['models'] = cigars;
          }

          this.segments[this.list]['sort'] = sort;
          this.segments[this.list]['ascending'] = ascending;
          this.segments[this.list]['total'] = take + skip;
        },
        (res) => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(res),
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }

  changeResource(resource) {
    this.router.navigate(['/my-cigars']);
    this.showCigarDetails = false;
    this.idOfCurrentCigarViewed = null;
    this.list = resource;
    this.getSortedList();
  }

  getSortedList() {
    Observable.forkJoin(this.setSort(DATE_SORT_FIELD), this.setAscending(false)).subscribe(
      (res) => {
        this.getCigars(
          this.segments[this.list]['sort'],
          this.segments[this.list]['ascending'],
          this.segments[this.list]['total'],
          0
        );
      },
      (err) => {
        this.getCigars(
          this.segments[this.list]['sort'],
          this.segments[this.list]['ascending'],
          this.segments[this.list]['total'],
          0
        );
      }
    );
  }

  loadMore() {
    this.getCigars(
      this.segments[this.list]['sort'],
      this.segments[this.list]['ascending'],
      DEFAULT_TAKE,
      this.segments[this.list]['total'],
      true
    );
  }

  sort(sort) {
    let ascending;
    if (this.segments[this.list]['sort'] == sort) {
      ascending = !this.segments[this.list]['ascending']
    } else if (sort == 'Product.RatingSummary.AverageRating' || sort == 'Product.MyRating.Rating') {
      ascending = false;
    } else {
      ascending = true;
    }

    this.getCigars(
      sort,
      ascending,
      this.segments[this.list]['total'],
      0
    );
    this.saveSortOptions(this.list, sort, ascending);
  }

  goToCustomCigar(id, list) {
    this.router.navigate(['/custom-cigar/' + list + '/' + id]);
  }

  toggleDetails(id, list) {
    if (window.innerWidth > 1200) {
      if (id === this.idOfCurrentCigarViewed) {
        this.showCigarDetails = !this.showCigarDetails;

        if (!this.showCigarDetails) {
          this.idOfCurrentCigarViewed = null;
          this.router.navigate(['/my-cigars']);
        }
      } else {
        this.idOfCurrentCigarViewed = id;
        this.showCigarDetails = true;
        this.router.navigate(['/my-cigars/' + list + '/' + id]);
      }
    } else {
      this.router.navigate(['/my-cigars/' + list + '/' + id]);
    }
  }

  addTo(cigarListItem: JournalItemModel | FavoritesItemModel | WishListItemModel) {
    this.cigarListActions.addTo(cigarListItem);
  }

  remove(cigarListItem: JournalItemModel | FavoritesItemModel | WishListItemModel) {
    this.cigarListActions.remove(cigarListItem);
  }

  closeDetails() {
    if (window.innerWidth > 1200) {
      this.showCigarDetails = !this.showCigarDetails;
      this.idOfCurrentCigarViewed = null;
    }
    this.router.navigate(['/my-cigars']);
  }

  saveSortOptions(list, sort, ascending) {
    this.segments[this.list]['sort'] = sort;
    this.segments[this.list]['ascending'] = ascending;
    this.storageService.set(list + 'Sort', sort).subscribe();
    this.storageService.set(list + 'Ascending', ascending).subscribe();
  }

  setSort(initial) {
    return new Observable((o: Observer<any>) => {
      this.storageService.get(this.list + 'Sort').subscribe(
        (sort) => {
          if (!sort) {
            sort = initial;
          }

          this.segments[this.list]['sort'] = sort;
          o.next(sort);
          return o.complete();
        },
        (err) => {
          this.segments[this.list]['sort'] = initial;
          return o.error(err);
        }
      );
    });
  }

  setAscending(initial) {
    return new Observable((o: Observer<any>) => {
      this.storageService.get(this.list + 'Ascending').subscribe(
        (ascending) => {
          if (!ascending) {
            ascending = initial;
          }
          this.segments[this.list]['ascending'] = ascending;
          o.next(ascending);
          return o.complete();
        },
        (err) => {
          this.segments[this.list]['ascending'] = initial;
          return o.error(err);
        }
      );
    });
  }

  hideOptions(cigar: ProductModel) {
    if (this.lastCigar) {
      this.lastCigar.ShowOptions = false;
    }
    this.lastCigar = cigar;
  }
}
