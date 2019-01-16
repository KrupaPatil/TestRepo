import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { AlertController } from 'ionic-angular';
import { LayoutController } from '../../../shared/services/layout.controller';
import { KnowledgeApiResource } from '../../../shared/resources/api/knowledge-api.resource';
import { CanonicalUrlService } from '../../../shared/services/canonical-url.service';
import { extractErrorMsg } from '../../../app/app.common';

@Component({
  selector: 'coming-soon',
  templateUrl: 'coming-soon.html'
})

export class ComingSoon {

  private item;
  private humidorListElement = <HTMLElement>document.querySelector('.humidor-outer-wrapper');
  private totalInfoElement = <HTMLElement>document.querySelector('.total-info');

  constructor(private sanitizer: DomSanitizer,
              private knowledgeApiResource: KnowledgeApiResource,
              private alertCtrl: AlertController,
              private layoutCtrl: LayoutController,
              private canonicalUrlService: CanonicalUrlService) {
  }

  ngOnInit() {
    this.knowledgeApiResource.getListItem(6167).subscribe(
      item => {
        if (item) {
          this.item = item;
          if (_.isString(this.item.Html)) {
            this.item.Html = this.item.Html
              .replace(/(src=")(?!(https?:)?\/\/)\/?/ig, '$1https://www.neptunecigar.com/')
              .replace(/(src="\/\/)/ig, 'src="https://');
            this.item.Html = this.sanitizer.bypassSecurityTrustHtml(this.item.Html);
          }
          this.canonicalUrlService.set(item.Url);
        }
      },
      err => {
        let alert = this.alertCtrl.create({
          title: 'Error occurred',
          subTitle: extractErrorMsg(err),
          buttons: ['OK']
        });
        return alert.present();
      }
    );

    this.layoutCtrl.configure({
      'showBackLink': true
    });

    this.humidorListElement.style.display = 'none';
    this.totalInfoElement.style.display = 'none';
  }

  ngOnDestroy() {
    this.humidorListElement.style.display = null;
    this.totalInfoElement.style.display = null;
  }
}
