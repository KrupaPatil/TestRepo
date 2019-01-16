import { Component } from "@angular/core";
import { LayoutController } from "../../shared/services/layout.controller";
import { RouterService } from "../../shared/services/router.service";
import { AlertController, Platform } from 'ionic-angular';


@Component({
  selector: 'rate',
  templateUrl: 'rate.html'
})
export class RatePage {


  constructor(private layoutCtrl: LayoutController,
              private alertCtrl: AlertController,
              private platform: Platform,
              private router: RouterService) {

  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'Rate This App',
      'showBackLink': true
    });
  }

  goToFeedback() {
    let alert = this.alertCtrl.create({
      subTitle: 'We\'re sorry to hear you\'re disappointed with Cigar Scanner. Please let us know what we can do to improve!',
      buttons: [
        {
          text: 'Ok',
          role: 'Ok',
          handler: () => {
            this.router.navigateByUrl('feedback');
          }
        }]
    });
    alert.present();
  }

  goToAppRating() {
    let alert = this.alertCtrl.create({
      subTitle: 'Thank You! We\'re glad to hear you enjoy our app, please leave us a feedback on the app store to help us improve!',
      buttons: [
        {
          text: 'Ok',
          role: 'Ok',
          handler: () => {
            if (this.platform.is('ios') || this.platform.is('android')) {
              this.platform.ready().then(() => {
                if (this.platform.is('ios')) {
                  open('https://itunes.apple.com/us/app/cigar-scanner/id1022032215?mt=8', "_system", "location=true");
                } else if (this.platform.is('android')) {
                  open('https://play.google.com/store/apps/details?id=com.ionicframework.cigarscanner238202&hl=en', "_system", "location=true");
                }
              });
            } else {
              window.open("https://play.google.com/store/apps/details?id=com.ionicframework.cigarscanner238202&hl=en", "_blank");
            }
          }
        }]
    });
    alert.present();
  }
}
