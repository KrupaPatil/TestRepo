import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { AlertController } from 'ionic-angular';
import { KnowledgeApiResource } from '../../shared/resources/api/knowledge-api.resource';
import { CanonicalUrlService } from '../../shared/services/canonical-url.service';
import { extractErrorMsg } from '../../app/app.common';

@Component({
  selector: 'privacy-policy',
  templateUrl: 'privacy-policy.html'
})

export class PrivacyPolicy {

  private item;

  constructor(private sanitizer: DomSanitizer,
              private knowledgeApiResource: KnowledgeApiResource,
              private alertCtrl: AlertController,
              private canonicalUrlService: CanonicalUrlService) {
  }

  ngOnInit() {
    this.knowledgeApiResource.getListItem(6166).subscribe(
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
  }
}
