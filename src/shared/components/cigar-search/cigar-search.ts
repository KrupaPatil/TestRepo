import { Component, EventEmitter, Input, Output, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from 'ionic-angular';
import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';

import { extractErrorMsg } from '../../../app/app.common';
import { HumidorModel } from '../../models/humidor.model';
import { JournalItemModel } from '../../models/journal-item.model';
import { ProductModel } from '../../models/product.model';
import { ProductResource } from '../../resources/product.resource';
import { SearchableResourceInterface } from '../../resources/searchable-resource.interface';
import { UserJournalResource } from '../../resources/user-journal.resource';

@Component({
  selector: 'cigar-search',
  templateUrl: 'cigar-search.html'
})
export class CigarSearch {
  @ViewChildren('searchInput') vc;

  @Input() searchJournal: boolean;
  @Input() humidor: HumidorModel;
  @Output() resultClick = new EventEmitter<ProductModel>();

  searchTerm$ = new Subject<string>();
  term: string;
  take: number = 10;
  allSkip = 0;
  journalSkip = 0;
  resultsAll: any[] = [];
  resultsJournal: any[] = [];
  showLoadMore: boolean = false;
  showLoadMoreJournal: boolean = false;
  viewType: string = 'all-cigars';
  addManually: boolean = false;


  constructor(private productResource: ProductResource,
              private userJournalResource: UserJournalResource,
              private alertCtrl: AlertController,
              private router: Router) {
  }

  ngOnInit() {
    this._search(this.productResource, this.allSkip, this.take)
      .subscribe(
        (products: ProductModel[]) => {
          this.allSkip = 0;
          this.resultsAll = [].concat(products);
          this.showLoadMore = products.length === this.take;
          this.addManually = true;
        },
        err => this._searchError(err)
      );

    if (this.searchJournal) {
      this._search(this.userJournalResource, this.journalSkip, this.take)
        .subscribe(
          (journalItems: JournalItemModel[]) => {
            this.journalSkip = 0;
            this.resultsJournal = [].concat(_.map(journalItems, item => item.Product));
            this.showLoadMoreJournal = journalItems.length === this.take;
          },
          err => this._searchError(err)
        );
    }
  }

  ngAfterViewInit() {
    this.vc.first.nativeElement.focus();
  }

  loadMore() {
    this.allSkip += this.take;

    this.productResource.search(this.term, this.allSkip, this.take)
      .subscribe(
        res => {
          this.resultsAll = this.resultsAll.concat(res);
          this.showLoadMore = res.length === this.take;
        },
        err => this._searchError(err)
      );
  }

  loadMoreJournal() {
    this.journalSkip += this.take;

    this.userJournalResource.search(this.term, this.journalSkip, this.take)
      .subscribe(
        res => {
          this.resultsJournal = this.resultsJournal.concat(_.map(res, item => item.Product));
          this.showLoadMoreJournal = res.length === this.take;
        },
        err => this._searchError(err)
      );
  }

  goToAddCustomCigarPage() {
    if (this.humidor) {
      this.router.navigate(['custom-cigar/add/humidor/' + this.humidor.Id]);
    } else {
      this.router.navigate(['custom-cigar/add/journal']);
    }
  }

  private _search(resource: SearchableResourceInterface, skip, take, list?) {
    return this
      .searchTerm$
      .debounceTime(400)
      .switchMap(term => {
        this.term = term;
        return resource.search(term, skip, take, list);
      });
  }

  private _searchError(err) {
    let alert = this.alertCtrl.create({
      title: 'Error occurred',
      subTitle: extractErrorMsg(err),
      buttons: ['OK']
    });
    alert.present();
  }

}
