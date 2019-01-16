import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HumidorModel } from '../../../shared/models/humidor.model';
import { LayoutController } from '../../../shared/services/layout.controller';
import { MyHumidorsService } from '../../../shared/services/my-humidors.service';
import { ActionSheetController, AlertController } from 'ionic-angular';
import { RouterService } from '../../../shared/services/router.service';
import { EmitterService } from '../../../shared/services/emitter.service';
import { ProductResource } from '../../../shared/resources/product.resource';
import { ProductModel } from '../../../shared/models/product.model';
import { extractErrorMsg } from "../../../app/app.common";

@Component({
  selector: 'page-add-cigar-from-search',
  templateUrl: 'add-cigar-from-search.html'
})
export class AddCigarFromSearchPage {
  private humidor: HumidorModel;
  private humidorListElement = <HTMLElement>document.querySelector('.humidor-list-wrapper');
  private humidorOuterWrapper = <HTMLElement>document.querySelector('.humidor-outer-wrapper');
  private cigarDetailsWrapper = <HTMLElement>document.querySelector('.cigar-details-wrapper.humudor-tab');



  constructor(private route: ActivatedRoute,
              private router: RouterService,
              private layoutCtrl: LayoutController,
              private actionSheetCtrl: ActionSheetController,
              private myHumidorsService: MyHumidorsService,
              private alertCtrl: AlertController,
              private emitterService: EmitterService,
              private productResource: ProductResource) {
    this.humidor = this.route.snapshot.data['humidor'];
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.humidor = data['humidor'];
      this.layoutCtrl.configure({
        'pageTitle': this.humidor.Name,
        'showBackLink': true
      });
    });

    this.humidorListElement.style.display = 'none';

    if (this.humidorOuterWrapper) {
      this.cigarDetailsWrapper.style.position = 'absolute';
      this.cigarDetailsWrapper.style.overflow = 'auto';
    }
  }

  addCigar(product) {
    this.productResource.get(product.Id)
      .subscribe(
        (product: ProductModel) => {
          if (product.ProductId) {
            return this._handleAddCigar(product);
          } else {
            let buttons: any = product.Shapes
              .map(shape => ({
                key: shape.ProductId,
                text: `${shape.Name.replace(product.Name, '').trim()} - ${this._displayShape(shape)} ${shape.Attributes.Length} x ${shape.Attributes.RingGauge}`,
                handler: () => {
                  this._handleAddCigar(shape);
                }
              }));

            buttons.push({
              text: 'Cancel', handler: () => {
              }
            });

            this.actionSheetCtrl.create({
              title: 'Please, Select Your Cigar',
              buttons: buttons,
              cssClass: 'action-sheet-ios'
            }).present();

            setTimeout(() => {
              const elemActionSheet = document.querySelector('ion-action-sheet');
              if (elemActionSheet && elemActionSheet.classList.contains('action-sheet-md')) {
                elemActionSheet.classList.remove('action-sheet-md');
              }
            });
          }
        },
        err => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(err),
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }

  private _displayShape(shape) {
    return shape.Attributes.Shape ? shape.Attributes.Shape : '';
  }

  private _handleAddCigar(product) {
    this.myHumidorsService.addCigar(this.humidor, product).subscribe(
      () => {
        this.router.navigate(['/my-humidors/' + this.humidor.Id]);
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

  ngOnDestroy() {
    this.humidorListElement.style.display = null;

    if (this.humidorOuterWrapper) {
      this.cigarDetailsWrapper.style.position = null;
      this.cigarDetailsWrapper.style.overflow = null;
    }
  }
}
