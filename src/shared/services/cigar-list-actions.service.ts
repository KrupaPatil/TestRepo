import { Injectable, Injector } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { FavoritesData } from '../data/favorites.data';
import { JournalData } from '../data/journal.data';
import { WishListData } from '../data/wish-list.data';
import { JOURNAL_LIST, JournalItemModel } from '../models/journal-item.model';
import { FAVORITES_LIST, FavoritesItemModel } from '../models/favorites-item.model';
import { UserDataSummaryResource } from '../../shared/resources/user-data-summary.resource';
import { WishListItemModel } from '../models/wish-list-item.model';
import { MyHumidorsService } from './my-humidors.service';
import * as _ from 'lodash';
import { createTemporaryId, extractErrorMsg } from '../../app/app.common';
import { ProductModel } from '../models/product.model';

@Injectable()
export class CigarListActionsService {

  private successAddFn;
  private errorAddFn;

  private journalData;
  private favoritesData;
  private wishListData;
  private cigarDetailsElement;

  constructor(private alertCtrl: AlertController,
              private myHumidorsService: MyHumidorsService,
              private actionSheetCtrl: ActionSheetController,
              private userDataSummaryResource: UserDataSummaryResource,
              private toastCtrl: ToastController,
              private injector: Injector) {
    this.journalData = this.injector.get(JournalData);
    this.favoritesData = this.injector.get(FavoritesData);
    this.wishListData = this.injector.get(WishListData);
  }

  addTo(cigarListItem, cigar?, successFn?, errorFn?) {
    let product = cigarListItem ? cigarListItem.Product : cigar;
    let logId = cigarListItem ? cigarListItem.Id : null;
    this.successAddFn = successFn;
    this.errorAddFn = errorFn;

    let buttons = this._createListButtons(product, logId);

    this.myHumidorsService.loadHumidors().subscribe(
      humidors => {
        if (product.ProductId || product.Shapes.length) {
          buttons = buttons.concat(this._createHumidorButtons(humidors, product, logId));
        }

        buttons.push({
          text: 'Cancel', handler: () => {
          }
        });

        this.actionSheetCtrl.create({
          title: 'Add this cigar to...',
          cssClass: 'action-sheet-ios',
          buttons: buttons
        }).present();
      }
    );

    this.cigarDetailsElement = <HTMLElement>document.querySelector('.cigar-details-container');
    if (this.cigarDetailsElement) {
      this.cigarDetailsElement.style.overflow = 'hidden';
    }
  }

  remove(cigarListItem: JournalItemModel | FavoritesItemModel | WishListItemModel, successFn?, errorFn?) {
    let alert = this.alertCtrl.create({
      title: 'Delete cigar from list',
      message: 'Are you sure you want to delete this cigar?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this._handleRemove(cigarListItem, successFn, errorFn);
          }
        }
      ]
    });

    alert.present();
  }

  reportBadResult(recordId) {
    this.journalData.reportBadResult(recordId).subscribe(
      (res) => {
        this.toastCtrl.create({
          message: 'Report has been sent',
          duration: 3000,
          position: 'top'
        }).present();
      },
      err => {
        let alert = this.alertCtrl.create({
          title: 'Error occurred',
          subTitle: extractErrorMsg(err),
          buttons: ['OK']
        });
        alert.present();
      }
    )
  }

  private updateUserDataSummary(item, isAddition) {
    if (this.userDataSummaryResource.listingsSummary) {
      let listType = '';
      if (item.List == 'wishlist') {
        listType = 'wishList'
      } else if (item.List == 'journal') {
        listType = 'myJournal'
      } else {
        listType = 'favorites'
      }

      if (isAddition) {
        this.userDataSummaryResource.listingsSummary[listType]++;
      } else {
        this.userDataSummaryResource.listingsSummary[listType]--;
      }
      this.userDataSummaryResource.updateSummary();
    }
  }

  private _handleRemove(cigarListItem, successFn, errorFn) {
    this._getResource(cigarListItem).remove(cigarListItem).subscribe(
      () => {
        if (successFn) {
          successFn(cigarListItem);
        }

        this.updateUserDataSummary(cigarListItem, false);
      },
      err => {
        let alert = this.alertCtrl.create({
          title: 'Error occurred',
          subTitle: extractErrorMsg(err),
          buttons: ['OK']
        });
        alert.present();

        errorFn(err);
      }
    );
  }

  private _getResource(cigarListItem): any {
    if (JOURNAL_LIST === cigarListItem.List) {
      return this.journalData;
    } else if (FAVORITES_LIST === cigarListItem.List) {
      return this.favoritesData;
    } else {
      return this.wishListData;
    }
  }

  private _createListButtons(product: ProductModel, logId) {
    let data = {Product: product};
    createTemporaryId(data);

    return [
      {
        text: 'My Journal',
        handler: () => {
          this.journalData.create(data, logId)
            .subscribe(
              res => this._successfulAddition(res),
              err => this._failedAddition(err)
            );
        }
      },
      {
        text: 'Favorites',
        handler: () => {
          this.favoritesData.create(data, logId)
            .subscribe(
              res => this._successfulAddition(res),
              err => this._failedAddition(err)
            );
        }
      },
      {
        text: 'Wish List',
        handler: () => {
          this.wishListData.create(data, logId)
            .subscribe(
              res => this._successfulAddition(res),
              err => this._failedAddition(err)
            );
        }
      }
    ];
  }

  private _successfulAddition(item) {
    this.updateUserDataSummary(item, true);

    this.toastCtrl.create({
      message: 'Cigar added',
      duration: 3000,
      position: 'top'
    }).present();

    if (this.successAddFn) {
      this.successAddFn(item);
    }

    if (this.cigarDetailsElement) {
      this.cigarDetailsElement.style.overflow = null;
    }
  }

  private _failedAddition(err) {
    this.alertCtrl.create({
      title: 'Error occurred',
      subTitle: extractErrorMsg(err),
      buttons: ['OK']
    }).present();

    if (this.errorAddFn) {
      this.errorAddFn(err);
    }
  }

  private _createHumidorButtons(humidors, product: ProductModel, logId) {
    return _.map(humidors, humidor => ({
        text: 'My Humidor: ' + humidor.Name,
        handler: () => {
          if (product.ProductId) {
            this._addProductToHumidor(humidor, product, logId);
            if (this.cigarDetailsElement) {
              this.cigarDetailsElement.style.overflow = null;
            }
          } else {
            let buttons = _.map(product.Shapes, shape => ({
              text: `${shape.Name} - ${shape.Attributes.Shape} ${shape.Attributes.Length} x ${shape.Attributes.RingGauge}`,
              handler: () => {
                this._addProductToHumidor(humidor, shape);
                if (this.cigarDetailsElement) {
                  this.cigarDetailsElement.style.overflow = null;
                }
              }
            }));

            buttons.push({
              text: 'Cancel', handler: () => {
                if (this.cigarDetailsElement) {
                  this.cigarDetailsElement.style.overflow = null;
                }
              }
            });

            this.actionSheetCtrl.create({
              cssClass: 'action-sheet-ios',
              buttons: buttons
            }).present();
          }
        }
      })
    );
  }

  private _addProductToHumidor(humidor, product, logId?) {
    this.myHumidorsService.addCigar(humidor, product, logId)
      .subscribe(
        res => this._successfulAddition(res),
        err => this._failedAddition(err)
      );
  }

}
