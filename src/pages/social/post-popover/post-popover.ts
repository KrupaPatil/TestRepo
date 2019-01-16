import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {NavParams} from 'ionic-angular';
@Component({
  templateUrl: 'post-popover.html'
})

export class PostPopoverPage {
  constructor(public viewCtrl: ViewController,
              public params: NavParams) {}
  close() {
    this.viewCtrl.dismiss();
  }

  deletePost() {
    this.params.get('showConfirm')();
    this.viewCtrl.dismiss();

  }
}
