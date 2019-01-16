import { Component, Inject } from '@angular/core';
import { LayoutController } from "../../../shared/services/layout.controller";

@Component({
  selector: 'about',
  templateUrl: 'about.html'
})
export class AboutPage {

  private currentDate: Date = new Date();
  private toolsMenuWrapper = <HTMLElement>document.querySelector('.tools-menu-wrapper');

  constructor(private layoutCtrl: LayoutController) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'About',
      'showBackLink': true
    });

    if (this.toolsMenuWrapper && window.innerWidth < 1200) {
      this.toolsMenuWrapper.style.display = 'none';
    }
  }

  openSite() {
    window.open('http://www.neptunecigar.com?src=CigarScanner', '_system', 'location=yes');
    return false;
  }

  ngOnDestroy() {
    if (this.toolsMenuWrapper && window.innerWidth < 1200) {
      this.toolsMenuWrapper.style.display = null;
    }
  }

}
