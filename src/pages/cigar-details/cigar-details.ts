import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from "ionic-angular";
import { LayoutController } from '../../shared/services/layout.controller';
import { ProductModel } from '../../shared/models/product.model';
import { JournalItemModel } from '../../shared/models/journal-item.model';
import { FavoritesItemModel } from '../../shared/models/favorites-item.model';
import { WishListItemModel } from '../../shared/models/wish-list-item.model';
import { RouterService } from '../../shared/services/router.service';
import { CigarListActionsService } from '../../shared/services/cigar-list-actions.service';
import { ProductReviewModel } from '../../shared/models/product-review.model';
import { ProductReviewResource } from "../../shared/resources/product-review.resource";
import { CanonicalUrlService } from '../../shared/services/canonical-url.service';
import { LocationService } from '../../shared/services/location.service';
import * as _ from 'lodash';
import { Title } from '@angular/platform-browser';
import { EmitterService } from '../../shared/services/emitter.service';
import { ImageSourceService } from '../../shared/services/image-source.service';
import { ShareService } from '../../shared/services/share.service';
import { JournalData } from '../../shared/data/journal.data';
import { createTemporaryId, extractErrorMsg } from '../../app/app.common';
import { UserJournalResource } from '../../shared/resources/user-journal.resource';
import { SocialPostData } from '../../shared/data/social-post.data';
import { RoutesStackService } from '../../shared/services/routes-stack.service';
import { MyHumidorsService } from '../../shared/services/my-humidors.service';
import { Location } from '@angular/common';

declare var window: any;

@Component({
  selector: 'cigar-details',
  templateUrl: 'cigar-details.html'
})
export class CigarDetailsPage {
  private cigar: ProductModel = null;
  private cigarListItem: JournalItemModel | FavoritesItemModel | WishListItemModel = null;
  private cigarListElement: any;
  private showDetails: boolean = true;
  private review: ProductReviewModel;
  private backgroundImageUrl = '';
  private pageLevel: number;
  private userRatedProduct: boolean = false;
  private biggestWidthImage: number = 0;
  private imageAspectRatio: number;
  private showBadResultButton;
  private isHumidorCigar = false;
  private recordId;

  constructor(private route: ActivatedRoute,
              private layoutCtrl: LayoutController,
              private router: RouterService,
              private productReviewResource: ProductReviewResource,
              private alertCtrl: AlertController,
              private cigarListActions: CigarListActionsService,
              private canonicalUrlService: CanonicalUrlService,
              private emitterService: EmitterService,
              private imageSourceService: ImageSourceService,
              private socialPostData: SocialPostData,
              private shareService: ShareService,
              private toastCtrl: ToastController,
              private routesStackService: RoutesStackService,
              private locationService: LocationService,
              public actionSheetCtrl: ActionSheetController,
              private journalData: JournalData,
              private location: Location,
              private myHumidorService: MyHumidorsService,
              private userJournalResource: UserJournalResource,
              private titleService: Title) {
    this.recordId = this.router.getParam('recordId');
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.cigar = data['cigar'];
      if (data['cigar'] && data['pageLevel'] == 3) {
        this.cigarListItem = (_.filter(this.myHumidorService.selectedHumidor.Cigars, cigar => {
          this.isHumidorCigar = true;
          return cigar.Product.ProductId == data['cigar'].ProductId
        }))[0];
      } else {
        this.cigarListItem = data['cigarListItem'];
      }
      if (this.cigarListItem) {
        this.cigar = this.cigarListItem.Product;
      } else {
        this.ifCigarOnTheList();
      }
      this.setImageRatio(this.cigar.Shapes);

      this.userRatedProduct = !!this.cigar.MyRating && this.cigar.MyRating.Rating > 0;

      this.pageLevel = data['pageLevel'];
      this.setBackgroundImageUrl();
      this.titleService.setTitle(this.cigar.Name);
      this.canonicalUrlService.set(this.cigar.CanonicalUrl);

      this.layoutCtrl.configure({
        'showHeader': true,
        'showFooter': true,
        'pageTitle': this.cigar.Name,
        'showMenuLink': false,
        'showSocialPostsGroup': false,
        'showBackLink': false,
        'manualBackButton': true,
        'backToJournal': false
      });

      if (this.cigar.MyRating) {
        this.cigar.MyRating.ProductId = this.cigar.ProductId;
        this.cigar.MyRating.LineId = this.cigar.LineId;
        this.review = new ProductReviewModel(this.cigar.MyRating);
      } else {
        this.review = new ProductReviewModel({
          ProductId: this.cigar.ProductId,
          LineId: this.cigar.LineId,
        });
      }

      this.route.queryParams.subscribe((params) => {
        if (params['fromNotification']) {
          this.location.replaceState(this.location.path().replace(/\?.*$/g, ""));
        }
        let previousUrl = this.routesStackService.getBackUrl();
        if (params.line) {
          this.showBadResultButton = true;
          this.layoutCtrl.configure({
            'showBackLink': true,
            'manualBackButton': false,
          });
        } else if (previousUrl == '/scan-cigar/master-line') {
          this.showBadResultButton = true;
        } else {
          this.showBadResultButton = false;
          this.layoutCtrl.configure({
            'showBackLink': false,
            'manualBackButton': true,
          });
        }
      });
    });

    this.route.queryParams.subscribe((params) => {
      if (params && (window.innerWidth > 1200)) {
        this.emitterService.openDetailsWhenLine();
      }
    });

    let detailsWrapper = document.querySelectorAll('cigar-details');
    let detailsContainer = <HTMLElement>document.querySelector('.details-container');
    let humidorAddButton = <HTMLElement>document.querySelector('.humidor-details-holder ion-fab');

    if (detailsContainer) {
      setTimeout(() => {
        detailsContainer.scrollTop = 0;
      })
    }

    if (detailsWrapper.length > 1) {
      for (let i = 0; i < detailsWrapper.length; i++) {
        let wrapper: any = detailsWrapper[i];
        if (i == detailsWrapper.length - 2) {
          wrapper.querySelector('.action-buttons').classList.add('hide-on-details');
          wrapper.querySelector('.cigar-details-container').classList.add('hide-on-details');
          wrapper.querySelector('.cigar-details-wrapper').classList.add('absolute');
        }
        if (i == detailsWrapper.length - 1) {
        }
      }
    }

    let resultsWrapper = <HTMLElement>document.querySelector('.master-line-inner-wrapper');
    if (resultsWrapper) {
      resultsWrapper.style.display = 'none';
    }

    let humidorListWrapper = <HTMLElement>document.querySelector('.humidor-list-wrapper');
    if (humidorListWrapper) {
      humidorListWrapper.style.display = 'none';
    }

    if (humidorAddButton) {
      humidorAddButton.style.display = 'none';
    }
  }

  ngOnDestroy() {
    if (window.innerWidth < 1200 && this.cigarListElement) {
      this.cigarListElement.style.display = 'initial';
      this.layoutCtrl.configure({
        'pageTitle': 'My Cigars',
        'showBackLink': false,
        'manualBackButton': false
      });
    }

    let mainDetailsContainer = <HTMLElement>document.querySelector('.cigar-details-container');
    if (mainDetailsContainer) {
      setTimeout(() => {
        mainDetailsContainer.scrollTop = 0;
      })
    }

    let actionButtons = <HTMLElement>document.querySelector('.action-buttons.hide-on-details');
    if (actionButtons) {
      actionButtons.classList.remove('hide-on-details');
    }

    let detailsContainer = <HTMLElement>document.querySelector('.cigar-details-container.hide-on-details');
    if (detailsContainer) {
      detailsContainer.classList.remove('hide-on-details');
    }

    let wrapperContainer = <HTMLElement>document.querySelector('.cigar-details-wrapper.absolute');
    if (wrapperContainer) {
      wrapperContainer.classList.remove('absolute');
    }

    let resultsWrapper = <HTMLElement>document.querySelector('.master-line-inner-wrapper');
    let isLevel3Active = <HTMLElement>document.querySelector('.master-line-wrapper .page-level-3.show');
    if (resultsWrapper && !isLevel3Active) {
      resultsWrapper.style.display = null;
    }

    let humidorAddButton = <HTMLElement>document.querySelector('.humidor-details-holder ion-fab');
    if (humidorAddButton) {
      humidorAddButton.style.display = null;
    }

    let humidorListWrapper = <HTMLElement>document.querySelector('.humidor-list-wrapper');
    if (humidorListWrapper) {
      humidorListWrapper.style.display = null;
    }

  }

  addTo() {
    this.cigarListActions.addTo(this.cigarListItem, this.cigar,
      () => {
        this.ifCigarOnTheList();
      });
  }

  remove() {
    if (this.isHumidorCigar) {
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
              this._handleProductDelete(this.cigarListItem);
            }
          }
        ]
      });

      alert.present();
    } else {
      this.cigarListActions.remove(this.cigarListItem,
        () => {
          this.emitterService.closeDetailsScreen();
        }
      );
    }
  }

  private _handleProductDelete(cigar) {
    this.myHumidorService.deleteCigar(this.myHumidorService.selectedHumidor, cigar).subscribe(
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

  ifCigarOnTheList() {
    this.userJournalResource.getItemByProductId(this.cigar.Id)
      .subscribe(
        (item) => {
          this.cigarListItem = item;
        },
        () => {
        }
      );
  }

  reportBadResult() {
    this.cigarListActions.reportBadResult(this.recordId);
  }

  shareOptions() {
    const shareOnFeedButton = {
      text: 'Share With Cigar Scanner Users',
      handler: () => {
        let ProductId: number = null;
        let LineId: number = null;
        let Title: string = 'Share On Cigar Scanner ' + this.cigar.Name;
        let Text = null;
        let Image = this.backgroundImageUrl;
        let Location: string;

        if (this.cigar.ProductId) {
          ProductId = this.cigar.ProductId;
        } else {
          LineId = this.cigar.LineId;
        }

        if (this.cigarListItem) {
          Location = this.cigarListItem.Location;
          this.shareCigarOnSocialFeed(ProductId, LineId, Title, Text, Image, Location);
        } else {
          this.locationService.getLocationAddress()
            .subscribe(
              address => {
                Location = address;
                this.shareCigarOnSocialFeed(ProductId, LineId, Title, Text, Image, Location);
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
      }
    };

    const otherOptionsButton = {
      text: 'Other Sharing options',
      handler: () => {
        this.shareService.shareProduct(this.cigar, this.backgroundImageUrl);
      }
    };

    const cancelButton = {
      text: 'Cancel',
      role: 'cancel'
    };

    let actionSheet;

    if (window.cordova) {
      actionSheet = this.actionSheetCtrl.create({
        title: 'Choose sharing options',
        cssClass: 'action-sheet-ios',
        buttons: [shareOnFeedButton, otherOptionsButton, cancelButton]
      });
    } else {
      actionSheet = this.actionSheetCtrl.create({
        title: 'Choose sharing options',
        cssClass: 'action-sheet-ios',
        buttons: [shareOnFeedButton, cancelButton]
      });
    }

    actionSheet.present();
  }

  shareCigarOnSocialFeed(ProductId, LineId, Title, Text, Image, Location) {
    this.socialPostData.createPost(ProductId, LineId, Title, Text, Image, Location).subscribe(
      res => {
        let toast = this.toastCtrl.create({
          message: 'You have posted on social feed',
          duration: 2000,
          position: 'top',
        });
        toast.present();
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

  toggleCigarLogInfo() {
    this.showDetails = false;
    this.router.navigate(['./cigar-log-info'], {relativeTo: this.route});
  }

  toggleRating() {
    this.showDetails = false;

    this.router.navigate(['./rating'], {relativeTo: this.route});
  }

  toggleNote() {
    this.showDetails = false;

    this.router.navigate(['./note'], {relativeTo: this.route});
  }

  toggleReviews(rating: number) {
    this.showDetails = false;

    this.router.navigate(['./reviews/' + rating], {relativeTo: this.route});
  }

  toggleAttribute(name: string) {
    if (name != 'SinglePackaging' && !this.cigar.Attributes[`${name}Description`]) {
      return;
    }

    this.showDetails = false;
    this.router.navigate(['./attribute/' + name], {relativeTo: this.route});
  }

  goToGallery() {
    if (this.backgroundImageUrl) {
      this.router.navigate(['./gallery', {imageUrl: this.backgroundImageUrl}], {relativeTo: this.route});
    }
  }

  setRating(cigar) {
    if (cigar.MyRating) {
      return cigar.MyRating.Rating;
    }

    if (!cigar.MyRating) {
      setTimeout(() => {
        cigar.MyRating = {
          Rating: 0
        };
        return cigar.MyRating.Rating;
      }, 0)
    }
  }

  setAllStars(rating) {
    if (this.userRatedProduct) {
      this.toggleRating();
      return
    }

    if (!this.cigarListItem) {
      this._addToJournalAndSetRating(rating);
    } else {
      this._setRating(rating);
    }
  }

  setBackgroundImageUrl() {
    if (this.cigarListItem && this.cigarListItem.UserImageUrl) {
      this.backgroundImageUrl = this.cigarListItem.UserImageUrl;
    } else if (this.cigar && this.cigar.UserImageUrl) {
      this.backgroundImageUrl = this.cigar.UserImageUrl;
    } else if (this.cigar && this.cigar.ImageUrl) {
      this.backgroundImageUrl = this.cigar.ImageUrl;
    } else {
      this.backgroundImageUrl = null;
      return null
    }

    return 'url(' + this.imageSourceService.createSrc(this.backgroundImageUrl) + ')';
  }

  getTagWeightClass(weight: number): string {
    weight = _.round(weight, 1);

    if (weight >= 0 && weight <= 1) {
      return 'weight-' + weight * 10;
    } else {
      return 'weight-5';
    }
  }

  private _addToJournalAndSetRating(rating) {
    let data = {Product: this.cigar};
    createTemporaryId(data);

    this.journalData.create(data)
      .subscribe(
        () => {
          this._setRating(rating);
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

  private _setRating(rating) {
    this.cigar.MyRating.Rating = rating;
    this.review.DrawRating = rating;
    this.review.AppearanceRating = rating;
    this.review.BurnRating = rating;
    this.review.AromaRating = rating;
    this.review.TasteRating = rating;
    this.cigar.MyRating.Rating = rating;
    this.cigar.MyRating = this.review;
    this.toggleRating();
  }

  setImageRatio(shapes) {
    let holdingContainer;
    for (let i = 0; i < shapes.length; i++) {
      let shapeWidth = shapes[i].ImageOfSingleWidth;
      if (shapeWidth > this.biggestWidthImage) {
        this.biggestWidthImage = shapeWidth;
      }
    }

    if (window.innerWidth > 1200) {
      holdingContainer = <HTMLElement>document.querySelector('.inner-cigar-wrapper');
      holdingContainer = holdingContainer.offsetWidth * 0.6;
      if (holdingContainer < this.biggestWidthImage) {
        this.imageAspectRatio = +(holdingContainer / this.biggestWidthImage).toFixed(4);
      } else {
        this.imageAspectRatio = +(this.biggestWidthImage / this.biggestWidthImage).toFixed(4);
      }
    } else {
      holdingContainer = window.innerWidth * 0.9;
      this.imageAspectRatio = +(holdingContainer / this.biggestWidthImage).toFixed(4);
    }
  }

  setCigarImageWidth(originalWidth) {
    return (originalWidth * this.imageAspectRatio + 'px');
  }

  showProductPosts() {
    this.emitterService.socialDetailsScreen(true);
    this.router.navigate(['social/' + this.cigar.Id]);
  }

}


