import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {NavParams} from 'ionic-angular';
@Component({
  templateUrl: 'social-group-popover.html'
})

export class SocialGroupPopover {
  constructor(public viewCtrl: ViewController,
              public params: NavParams) {}

  selectPostsGroup(data) {
    this.params.get('showOptions')(data);
    this.viewCtrl.dismiss();
  }
}
