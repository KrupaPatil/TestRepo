import { Component } from '@angular/core';
import { LayoutController } from '../../../shared/services/layout.controller';
import { ProductModel } from '../../../shared/models/product.model';
import { RouterService } from '../../../shared/services/router.service';
import { ActivatedRoute } from '@angular/router';
import { PageLevelService } from '../../../shared/services/page-level.service';

@Component({
  selector: 'cigar-attribute',
  templateUrl: 'cigar-attribute.html'
})
export class CigarAttribute {

  private cigar: ProductModel;
  private attributeName: string = '';
  private attribute: string = '';
  private attributeDescription: string = '';
  private cigarDetailsElement;

  constructor(private layoutCtrl: LayoutController,
              private router: RouterService,
              private styleResolver: PageLevelService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe((data: any) => {
      this.cigar = data.cigar || data.cigarListItem.Product;

      if (!this.cigar) {
        this.router.navigateToRoot();
      }

      this.route.params.subscribe(params => {
        this.attributeName = params['Name'];
        this.attribute = this.cigar.Attributes[this.attributeName];
        this.attributeDescription = this.cigar.Attributes[this.attributeName + 'Description'];

        this.layoutCtrl.configure({
          'pageTitle': this.attributeName,
        });
      });
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

}
