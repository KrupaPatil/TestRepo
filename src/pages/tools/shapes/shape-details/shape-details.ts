import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ShapeModel} from '../../../../shared/models/shape.model';
import {LayoutController} from "../../../../shared/services/layout.controller";

@Component({
  selector: 'shapes-details',
  templateUrl: 'shape-details.html'
})
export class ShapeDetailsPage {

  private shape: ShapeModel;
  private scrollElement: any;

  constructor(private route: ActivatedRoute,
              private layoutCtrl: LayoutController) {
    this.shape = this.route.snapshot.data['shape'];
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': this.shape.Name,
      'showBackLink': true
    });

    this.scrollElement = <HTMLElement>document.querySelectorAll('.page-level-1 .scroll-content')[0];
    this.scrollElement.scrollTop = 0;
    this.scrollElement.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    this.scrollElement.style.overflow = 'auto';
  }

}
