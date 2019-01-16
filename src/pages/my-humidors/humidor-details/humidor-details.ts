import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { extractErrorMsg, throwError } from '../../../app/app.common';
import { HumidorCigarModel } from '../../../shared/models/humidor-cigar.model';
import { HumidorModel } from '../../../shared/models/humidor.model';
import { CameraService } from '../../../shared/services/camera.service';
import { EmitterService } from '../../../shared/services/emitter.service';
import { LayoutController } from '../../../shared/services/layout.controller';
import { MyHumidorsService } from '../../../shared/services/my-humidors.service';
import { RouterService } from '../../../shared/services/router.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'humidor-details',
  templateUrl: 'humidor-details.html'
})
export class HumidorDetailsPage {
  private humidor: HumidorModel = null;
  private showAddButtons: boolean = false;
  private pageLevel: number;
  private showCigarDetails: boolean = false;
  private idOfCurrentCigarViewed: number = null;
  private sortCriteria: string;
  private sortDirection: boolean;
  private showPlusButton: boolean = false;
  private quantityInput;
  private observable;
  private humidorListElement = <HTMLElement>document.querySelector('.humidor-outer-wrapper');
  private totalInfoElement = <HTMLElement>document.querySelector('.total-info');

  constructor(private route: ActivatedRoute,
              private layoutCtrl: LayoutController,
              private alertCtrl: AlertController,
              private router: RouterService,
              private cameraService: CameraService,
              private emitterService: EmitterService,
              private storageService: StorageService,
              private myHumidorsService: MyHumidorsService,
              private location: Location,
              private titleService: Title) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.humidor = data['humidor'];
      this.pageLevel = data['pageLevel'];
      this.titleService.setTitle(this.humidor.Name);
      this.layoutCtrl.configure({
        'pageTitle': this.humidor.Name,
        'showBackLink': true
      });

      this.storageService.get('HumidorSortCriteria').subscribe(
        (criteria) => {
          criteria ? this.sortCriteria = criteria : this.sortCriteria = 'date';
          this.storageService.get('HumidorSortDirection').subscribe(
            (direction) => {
              direction ? this.sortDirection = direction : this.sortDirection = false;
              this.sortCigarsInHumidor(this.sortCriteria);
            }
          )
        }
      )
    });

    this.emitterService.detailsWhenLineStatus.subscribe((whenLineStatus: boolean) => {
      setTimeout(() => {
        this.showCigarDetails = true;
      })
    });

    if (window.innerWidth > 1200 && this.showCigarDetails) {
      this.emitterService.detailsScreenStatus.subscribe((screenStatus: boolean) => {
        this.showCigarDetails = false;
      });
    }

    this.emitterService.humidorDetailsScreenStatus.subscribe((humidorDetailScreenStatus: boolean) => {
      this.showCigarDetails = false;
      this.idOfCurrentCigarViewed = null;
      this.router.navigateByUrl('/my-humidors/' + this.humidor.Id);
    });

    this.router.getEvents().subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url.indexOf('cigar') == -1) {
        this.showCigarDetails = false;
        this.idOfCurrentCigarViewed = null;
      }
    });

    //fix for disappearing plus icon on ios
    setTimeout(() => {
      this.showPlusButton = true;
    }, 500);

    this.humidorListElement.style.display = 'none';
    this.totalInfoElement.style.display = 'none';
  }

  ngAfterViewInit() {
    this.quantityInput = <HTMLElement>document.querySelector('.value');
    if (!this.quantityInput) return;
    this.observable = Observable.fromEvent(this.quantityInput, 'input');
    this.observable
      .debounceTime(500)
      .subscribe((event) => {
        let value = parseInt(event.target.value);
        let index = event.target.id;

        if (value < 0) {
          value = 0;
        } else if (value >= 999) {
          value = 999;
        }

        if (value) {
          this.increaseProductCount(this.humidor.Cigars[index], value)
        }
      })
  }

  toggleMenu() {
    this.showAddButtons = !this.showAddButtons;
  }

  checkIfFalseValue(value, index) {
    if (!value) {
      value = 0;
    }
    this.increaseProductCount(this.humidor.Cigars[index], value)
  }

  increaseProductCount(cigar: HumidorCigarModel, quantity?) {
    if (!quantity && cigar.Quantity >= 999) return;
    this.myHumidorsService.increaseCigarQuantity(this.humidor, cigar, quantity).subscribe(
      () => {
        let direction = this.sortDirection ? 'asc' : 'desc';
        this.myHumidorsService.sortCigarsInHumidor(this.humidor, this.sortCriteria, direction);
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

  decreaseProductCount(cigar: HumidorCigarModel) {
    this.myHumidorsService.decreaseCigarQuantity(this.humidor, cigar).subscribe(
      () => {
        let direction = this.sortDirection ? 'asc' : 'desc';
        this.myHumidorsService.sortCigarsInHumidor(this.humidor, this.sortCriteria, direction);
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

  deleteCigar(cigar: HumidorCigarModel) {
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
            this._handleProductDelete(cigar);
          }
        }
      ]
    });

    alert.present();
  }

  showDetails(cigar: HumidorCigarModel) {
    let url = 'my-humidors/' + this.humidor.Id;

    if (cigar.Product.IsCustom) {
      url += '/custom-cigar';
      this.router.navigate([url], {queryParams: {id: cigar.Product.Id}});
    } else {
      url += '/cigar/P-' + cigar.Product.ProductId;
      this.router.navigate([url]);
    }
  }

  toggleDetails(cigar) {
    if (window.innerWidth > 1200) {
      if (!this.showCigarDetails) {
        this.showCigarDetails = true;
        this.idOfCurrentCigarViewed = cigar.ProductId;
        this.showDetails(cigar);
      } else {
        if (this.idOfCurrentCigarViewed == cigar.ProductId) {
          this.showCigarDetails = false;
          this.idOfCurrentCigarViewed = null;
          this.router.navigateByUrl('/my-humidors/' + this.humidor.Id);
        } else {
          this.idOfCurrentCigarViewed = cigar.ProductId;
          this.showDetails(cigar);
        }
      }
    } else {
      this.showDetails(cigar);
    }
  }

  private _handleProductDelete(cigar: HumidorCigarModel) {
    this.myHumidorsService.deleteCigar(this.humidor, cigar).subscribe(
      () => {
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

  takePicture() {
    this.cameraService.takePicture()
      .subscribe(
        () => {
          return this.router.navigateWithParams(['/scan-cigar'], {humidor: this.humidor});
        },
        (error) => {
          if (error) {
            throwError(`Error taking picture ${JSON.stringify(error)}`);
          }
        }
      );
  }

  sortCigarsInHumidor(criteria) {
    if (this.sortCriteria == criteria) {
      this.sortDirection = !this.sortDirection;
    } else {
      this.sortDirection = true;
    }
    this.sortCriteria = criteria;
    this.storageService.set('HumidorSortCriteria', this.sortCriteria).subscribe();
    this.storageService.set('HumidorDirectionCriteria', this.sortDirection).subscribe();

    let direction = this.sortDirection ? 'asc' : 'desc';
    this.myHumidorsService.sortCigarsInHumidor(this.humidor, this.sortCriteria, direction);
  }

  backButton() {
    return this.location.back();
  }

  ngOnDestroy() {
    this.humidorListElement.style.display = null;
    this.totalInfoElement.style.display = null;
  }

}
