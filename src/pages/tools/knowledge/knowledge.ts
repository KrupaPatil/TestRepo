import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from 'ionic-angular';

import { extractErrorMsg } from '../../../app/app.common';
import { KnowledgeModel } from '../../../shared/models/knowledge.model';
import { KnowledgeResource } from '../../../shared/resources/knowledge.resource';
import { LayoutController } from '../../../shared/services/layout.controller';

@Component({
  selector: 'knowledge',
  templateUrl: 'knowledge.html'
})
export class KnowledgePage {

  listItems: KnowledgeModel[];

  constructor(
    private layoutCtrl: LayoutController,
    private alertCtrl: AlertController,
    private knowledgeResource: KnowledgeResource,
    private router: Router
  ) { }

  ngOnInit() {
    this.layoutCtrl.configure({
      pageTitle: 'Cigar 101',
      showBackLink: true,
      manualBackButton: false
    });
    this.getList();
  }

  getList() {
    this.knowledgeResource.getList()
      .subscribe(
        (listItems: KnowledgeModel[]) => {
          this.listItems = listItems;
        },
        (err) => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(err),
            buttons: ['OK']
          });
          alert.present();
        }
      )
  }

  goToListItem(id) {
    this.router.navigate(['/tools/knowledge/' + id]);
  }

  ngOnDestroy() {
    this.layoutCtrl.configure({
      pageTitle: 'Tools',
      showMenuLink: true,
      showBackLink: false,
      showHeader: true,
      showFooter: true
    });
  }

}
