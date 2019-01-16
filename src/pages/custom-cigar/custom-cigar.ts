import { Component } from '@angular/core';
import { LayoutController } from '../../shared/services/layout.controller';
import { AlertController, LoadingController } from 'ionic-angular';
import { ManualCigarEntryModel } from '../../shared/models/manual-cigar-entry.model';
import { ProductResource } from '../../shared/resources/product.resource';
import { ProductModel } from '../../shared/models/product.model';
import { JournalData } from '../../shared/data/journal.data';
import { createTemporaryId, extractErrorMsg } from '../../app/app.common';
import { JournalItemModel } from '../../shared/models/journal-item.model';
import { RouterService } from '../../shared/services/router.service';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { MyHumidorsService } from '../../shared/services/my-humidors.service';
import { HumidorModel } from '../../shared/models/humidor.model';
import { RoutesStackService } from '../../shared/services/routes-stack.service';
import { CigarListActionsService } from '../../shared/services/cigar-list-actions.service';
import { EmitterService } from '../../shared/services/emitter.service';

@Component({
  selector: 'custom-cigar',
  templateUrl: 'custom-cigar.html'
})

export class CustomCigarPage {

  private cigarListItem;
  private humidorItem;
  private heading;
  private cigar: ProductModel;
  private humidor: HumidorModel;
  private pageTitle: string = 'Add Your Cigar';
  private cigarData: ManualCigarEntryModel = new ManualCigarEntryModel({});

  constructor(private layoutCtrl: LayoutController,
              private alertCtrl: AlertController,
              private productResource: ProductResource,
              private journalData: JournalData,
              private loadingCtrl: LoadingController,
              private router: RouterService,
              private cigarListActions: CigarListActionsService,
              private emitterService: EmitterService,
              private route: ActivatedRoute,
              private myHumidors: MyHumidorsService,
              private routesStackService: RoutesStackService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.heading = data['title'];
      if (data['cigar']) {
        if (data['cigar']['Product']) {
          this.cigarListItem = data['cigar'];
          this.cigar = data['cigar']['Product'];
        } else {
          this.cigar = data['cigar']
        }
      }

      this.humidor = data['humidor'];
      if (this.humidor) {
        let productId;
        this.route.queryParams.subscribe(params  => {
          let queryParams:any = params;
          productId = queryParams.id;
        })
        this.humidorItem = _.find(this.humidor.Cigars, {'ProductId': productId});
        if (this.humidorItem) {
          this.cigar = this.humidorItem.Product;
        }
      }

      if (this.cigar) {
        _.assignIn(this.cigarData, this.cigar);
        this.pageTitle = this.cigar.Name;
      }
    });

    this.layoutCtrl.configure({
      'pageTitle': this.pageTitle,
      'showBackLink': true
    });
  }

  submit(valid) {
    if (!valid) return;

    if (this.cigar) {
      this._edit();
    } else {
      this._add();
    }
  }

  remove() {
    if (this.humidor) {
      let alert = this.alertCtrl.create({
        title: 'Delete cigar from humidor',
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
              this.myHumidors.deleteCigar(this.myHumidors.selectedHumidor, this.humidorItem).subscribe(
                () => {
                  this.emitterService.closeHumidorDetailsScreen();
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
          }
        ]
      });

      alert.present();
    } else {
      this.cigarListActions.remove(this.cigarListItem, ()=> {this.router.navigate(['/my-cigars'])})
    }
  }

  getButtonText() {
    if (this.cigar) {
      return 'Save';
    } else if (this.humidor) {
      return 'Add Cigar to Humidor';
    } else {
      return 'Add Cigar to My Journal';
    }
  }

  private _add() {
    let loading = this._showLoading();

    createTemporaryId(this.cigarData);

    this.productResource.createCustom(this.cigarData)
      .subscribe(
        (product: ProductModel) => {
          if (this.humidor) {
            this._addToHumidor(this.humidor, product, loading);
          } else {
            this._addToCigarLog(product, loading);
          }
        },
        err => {
          this._showError(err, loading);
        }
      )
  }

  private _addToCigarLog(product, loading) {
    let data = {Product: product};
    createTemporaryId(data);
    this.journalData.create(data)
      .subscribe(
        (item: JournalItemModel) => {
          loading.dismiss();

          this.router.navigate(['my-cigars']);
        },
        err => {
          this._showError(err, loading);
        }
      );
  }

  private _addToHumidor(humidor, product, loading) {
    this.myHumidors.addCigar(humidor, product)
      .subscribe(
        () => {
          loading.dismiss();

          this.router.navigate(['my-humidors/' + humidor.Id]);
        },
        err => {
          this._showError(err, loading);
        }
      );
  }

  private _edit() {
    let loading = this._showLoading();

    _.assignIn(this.cigar, this.cigarData);

    this.productResource.updateCustom(this.cigar)
      .subscribe(
        (product: ProductModel) => {
          loading.dismiss();

          const backUrl = this.routesStackService.getBackUrl();

          if (backUrl) {
            this.router.navigateByUrl(backUrl);
          } else {
            this.router.navigate(['my-cigars']);
          }
        },
        err => {
          this._showError(err, loading);
        }
      );
  }

  private _showLoading() {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    return loading;
  }

  private _showError(err, loading) {
    loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Error occurred',
      subTitle: extractErrorMsg(err),
      buttons: ['OK']
    });
    alert.present();
  }
}
