import { Component } from '@angular/core';
import { LayoutController } from "../../../shared/services/layout.controller";

@Component({
  selector: 'wrapper-color',
  templateUrl: 'wrapper-color.html'
})
export class WrapperColorPage {
  private toolsMenuWrapper = <HTMLElement>document.querySelector('.tools-menu-wrapper');

  constructor(private layoutCtrl: LayoutController) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'Wrapper Colors',
      'showBackLink': true
    });

    if (window.innerWidth < 1200) {
      this.toolsMenuWrapper.style.display = 'none';
    }
  }

  ngOnDestroy() {
    if (window.innerWidth < 1200) {
      this.toolsMenuWrapper.style.display = null;
    }
  }
}
