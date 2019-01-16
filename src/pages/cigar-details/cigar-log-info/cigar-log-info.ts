import { Component, Injector } from '@angular/core';
import { LayoutController } from '../../../shared/services/layout.controller';
import { RouterService } from '../../../shared/services/router.service';
import { AlertController } from 'ionic-angular';
import { JOURNAL_LIST, JournalItemModel } from '../../../shared/models/journal-item.model';
import { FAVORITES_LIST, FavoritesItemModel } from '../../../shared/models/favorites-item.model';
import { MyHumidorsService } from '../../../shared/services/my-humidors.service';
import { ImageSourceService } from '../../../shared/services/image-source.service';
import { WishListItemModel } from '../../../shared/models/wish-list-item.model';
import { Location } from '@angular/common';
import { JournalData } from '../../../shared/data/journal.data';
import { FavoritesData } from '../../../shared/data/favorites.data';
import { WishListData } from '../../../shared/data/wish-list.data';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { PageLevelService } from '../../../shared/services/page-level.service';
import { extractErrorMsg, throwError } from '../../../app/app.common';
import { UserJournalResource } from '../../../shared/resources/user-journal.resource';
import { CameraService } from '../../../shared/services/camera.service';
import { CigarLogInfoService } from '../../../shared/services/cigar-log-info.service';


@Component({
  selector: 'cigar-log-info',
  templateUrl: 'cigar-log-info.html'
})
export class CigarLogInfo {

  private cigarListItem: JournalItemModel | FavoritesItemModel | WishListItemModel;
  private cigarDate: string;
  private cigarLocation: string;
  private userImageUrl: string;
  private cigarPrice: number;
  private backgroundImageUrl: string;
  private humidorCigar = false;
  private cigarDetailsElement;
  private resource: JournalData | FavoritesData | WishListData;

  constructor(private layoutCtrl: LayoutController,
              private router: RouterService,
              private alertCtrl: AlertController,
              private location: Location,
              private injector: Injector,
              private cameraService: CameraService,
              private cigarInfoService: CigarLogInfoService,
              private myHumidorService: MyHumidorsService,
              private userJournalResource: UserJournalResource,
              private styleResolver: PageLevelService,
              private imageSourceService: ImageSourceService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe((data: any) => {
      if (data.cigar && data['pageLevel'] == 3) {
        this.humidorCigar = true;
        this.cigarListItem = (_.filter(this.myHumidorService.selectedHumidor.Cigars, cigar => {
          return cigar.Product.ProductId == data.cigar.ProductId
        }))[0];
        this.initValues();
      } else if (data['cigarListItem']) {
        this.cigarListItem = data['cigarListItem'];
        this.initValues();

      } else {
        this.userJournalResource.getItemByProductId(data['cigar'].Id)
          .subscribe(
            (item) => {
              this.cigarListItem = item;
              if (!this.cigarListItem) {
                this.router.navigateToRoot();
              } else {
                this.initValues();
              }
            },
            () => {
            }
          );
      }

    });

    this.layoutCtrl.configure({
      'pageTitle': 'Edit Info',
    });

    this.styleResolver.cigarDetailsSubPagesOnInit();
  }

  initValues() {
    this._initResource();
    this.cigarDate = new Date(this.cigarListItem.Date).toISOString();
    this.cigarLocation = this.cigarListItem.Location;
    this.cigarPrice = _.toNumber(this.cigarListItem.Price);
  }

  ngOnDestroy() {
    if (window.innerWidth < 1200 && this.cigarDetailsElement) {
      this.cigarDetailsElement.style.display = 'block';
      this.layoutCtrl.configure({
        'pageTitle': this.cigarListItem.Product.Name,
        'showBackLink': true
      });
    }

    this.styleResolver.cigarDetailsSubPagesOnDestroy();
  }

  takePicture() {
    this.cameraService.takePicture()
      .subscribe(
        (res:any) => {
          let data = this.cameraService.imageToFormData(res.data);
          this.cigarInfoService.getImageUrl(data).subscribe(
            (imageUrl)=> {
              this.userImageUrl = imageUrl;
            },
            (res)=> {
              console.log(JSON.stringify(res) );
            }
          )
        },
        (error) => {
          if (error) {
            throwError(`Error taking picture ${JSON.stringify(error)}`);
          }
        }
      );
  }

  setBackgroundImageUrl() {
    if (this.userImageUrl) {
      this.backgroundImageUrl = this.userImageUrl;
    }
    else if (this.cigarListItem && this.cigarListItem.UserImageUrl) {
      this.backgroundImageUrl = this.cigarListItem.UserImageUrl;
    } else if (this.cigarListItem.Product.ImageUrl) {
      this.backgroundImageUrl = this.cigarListItem.Product.ImageUrl;
    } else {
      this.backgroundImageUrl = null;
      return null
    }
    return 'url(' + this.imageSourceService.createSrc(this.backgroundImageUrl) + ')';
  }

  setBackgroundImageHeight() {
    if (!this.backgroundImageUrl) return '';
    if (window.innerWidth > 1200) {
      return '300px'
    } else {
      return '200px'
    }
  }

  submit() {
    let data = {
      Date: this.cigarDate,
      Location: this.cigarLocation,
      Price: this.cigarPrice
    };

    if (this.userImageUrl) data['UserImageUrl'] = this.userImageUrl;

    if (this.humidorCigar) {
      this.cigarListItem.Date = data.Date;
      this.cigarListItem.Location = data.Location;
      this.cigarListItem.Price = data.Price;
      if (this.userImageUrl) this.cigarListItem.UserImageUrl = this.userImageUrl;

      this.myHumidorService.updateCigar(this.cigarListItem)
        .subscribe(
          () => {
              this.location.back();
          },
          (res) => {
            let alert = this.alertCtrl.create({
              title: 'Error occurred',
              subTitle: extractErrorMsg(res),
              buttons: ['OK']
            });
            alert.present();
          })
    } else {
      this.resource.update(this.cigarListItem, data)
        .subscribe(
          () => {
              this.location.back();
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

  private _initResource() {
    if (JOURNAL_LIST === this.cigarListItem.List) {
      this.resource = this.injector.get(JournalData);
    } else if (FAVORITES_LIST === this.cigarListItem.List) {
      this.resource = this.injector.get(FavoritesData);
    } else {
      this.resource = this.injector.get(WishListData);
    }
  }

}
