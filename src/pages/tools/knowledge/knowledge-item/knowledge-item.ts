import { AfterViewChecked, Component, ElementRef, Renderer, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AlertController, Platform } from 'ionic-angular';
import * as _ from 'lodash';

import { extractErrorMsg } from '../../../../app/app.common';
import { KnowledgeResource } from '../../../../shared/resources/knowledge.resource';
import { CanonicalUrlService } from '../../../../shared/services/canonical-url.service';
import { LayoutController } from '../../../../shared/services/layout.controller';

@Component({
  selector: 'knowledge-item',
  templateUrl: 'knowledge-item.html'
})

export class KnowledgeItemPage implements AfterViewChecked {

  @ViewChild('itemHtml') el: ElementRef;

  private item;
  private contentLinks = [];
  private currentYear;

  constructor(private knowledgeResource: KnowledgeResource,
              private layoutCtrl: LayoutController,
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private renderer: Renderer,
              private platform: Platform,
              private alertCtrl: AlertController,
              private canonicalUrlService: CanonicalUrlService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = +params['Id'];

      this.knowledgeResource.getListItem(id).subscribe(
        item => {
          this.item = item;

          this.layoutCtrl.configure({
            pageTitle: this.item.Title,
            showBackLink: false,
            manualBackButton: true,
            showMenuLink: false
          });

          if (_.isString(this.item.Html)) {
            this.item.Html = this.item.Html
              .replace(/(src=")(?!(https?:)?\/\/)\/?/ig, '$1https://www.neptunecigar.com/')
              .replace(/(src="\/\/)/ig, 'src="https://');
            this.item.Html = this.sanitizer.bypassSecurityTrustHtml(this.item.Html);
          }

          this.canonicalUrlService.set(item.Url);
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
    });

    this.currentYear = (new Date()).getFullYear();
  }

  ngAfterViewChecked() {
    if (!this.el) return;

    _.each(this.el.nativeElement.querySelectorAll('a'), link => {
      if (this.contentLinks.indexOf(link) === -1) {
        this.contentLinks.push(link);

        this.renderer.listen(link, 'click', (event) => {
          event.preventDefault();
          this.goTo(link.getAttribute('href'));
        });
      }
    });
  }

  goTo(url) {
    window.open(url, '_blank');
  }
}
