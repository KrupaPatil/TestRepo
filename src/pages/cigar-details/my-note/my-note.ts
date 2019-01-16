import { Component } from '@angular/core';
import { LayoutController } from '../../../shared/services/layout.controller';
import { ProductModel } from '../../../shared/models/product.model';
import { RouterService } from '../../../shared/services/router.service';
import { AlertController } from 'ionic-angular';
import { ProductResource } from '../../../shared/resources/product.resource';
import { MyHumidorsService } from '../../../shared/services/my-humidors.service';
import { ProductNoteModel } from '../../../shared/models/product-note.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PageLevelService } from '../../../shared/services/page-level.service';
import { createTemporaryId, extractErrorMsg } from '../../../app/app.common';
import { JournalData } from '../../../shared/data/journal.data';
import * as _ from 'lodash';

@Component({
  selector: 'my-note',
  templateUrl: 'my-note.html'
})
export class MyNote {

  private cigar: ProductModel;
  private cigarListItem;
  private text: string = '';
  private textError: boolean = false;
  private cigarDetailsElement;
  private isHumidorCigar: boolean = false;

  constructor(private layoutCtrl: LayoutController,
              private router: RouterService,
              private alertCtrl: AlertController,
              private productResource: ProductResource,
              private styleResolver: PageLevelService,
              private route: ActivatedRoute,
              private location: Location,
              private myHumidorService: MyHumidorsService,
              private journalData: JournalData) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe((data: any) => {
      if (data.cigar && data.pageLevel == 3) {
        this.cigar = (_.filter(this.myHumidorService.selectedHumidor.Cigars, cigar => {
          this.isHumidorCigar = true;
          return cigar.Product.ProductId == data.cigar.ProductId
        }))[0].Product;
      } else {
        this.cigar = data.cigar || data.cigarListItem.Product;
      }

      this.cigarListItem = data.cigarListItem;
      if (!this.cigar) {
        this.router.navigateToRoot();
      }

      if (this.cigar.MyNote) {
        this.text = this.cigar.MyNote.Note;
      }
    });

    this.layoutCtrl.configure({
      'pageTitle': 'Personal Note',
    });

    this.styleResolver.cigarDetailsSubPagesOnInit();
  }

  ngOnDestroy() {
    if (window.innerWidth < 1200 && this.cigarDetailsElement) {
      this.cigarDetailsElement.style.display = 'block';
      this.layoutCtrl.configure({
        'pageTitle': this.cigar.Name,
        'showBackLink': true
      });
    }

    this.styleResolver.cigarDetailsSubPagesOnDestroy();
  }

  submit(valid) {
    if (valid) {
      if (!this.cigarListItem) {
        this._addToJournalAndSaveNote();
      } else {
        this._saveNote();
      }
    }
  }

  private _addToJournalAndSaveNote() {
    let data = {Product: this.cigar};
    createTemporaryId(data);

    this.journalData.create(data)
      .subscribe(
        () => {
          this._saveNote();
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

  private _saveNote() {
    if (!this.cigar.MyNote) {
      this.cigar.MyNote = new ProductNoteModel({Note: this.text});
    } else {
      this.cigar.MyNote.Note = this.text;
    }

    this.productResource.saveNote(this.cigar)
      .subscribe(
        () => {
          return this.location.back();
        },
        (err) => {
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
