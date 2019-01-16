import { Component } from '@angular/core';
import { ShapeModel } from '../../../shared/models/shape.model';
import { ShapeResource } from '../../../shared/resources/shape.resource';
import { LayoutController } from "../../../shared/services/layout.controller";

@Component({
  selector: 'shapes',
  templateUrl: 'shapes.html'
})
export class ShapesPage {

  private shapes: [ShapeModel];

  constructor(private shapeResource: ShapeResource,
              private layoutCtrl: LayoutController) {
  }

  ngOnInit() {
    this.getShapes();

    this.layoutCtrl.configure({
      'pageTitle': 'Shapes',
      'showBackLink': true
    });
  }

  getShapes() {
    this.shapeResource.getList()
      .subscribe(
        (shapes: [ShapeModel]) => {
          this.shapes = shapes;
        },
        (err) => {
        }
      );
  }

  getShapeStyle(shape: ShapeModel) {
    return {
      'background-image': 'url(assets/images/shapes/shapes_3_BROWN_' + shape.Id + '.png)',
      'background-repeat': 'no-repeat',
      'height': shape.Height + 'px'
    };
  }

}
