import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from 'ionic-angular';

import { extractErrorMsg } from '../../../app/app.common';
import { UserSignUpModel } from '../../../shared/models/user-sign-up.model';
import { AccountService } from '../../../shared/services/account.service';
import { LayoutController } from '../../../shared/services/layout.controller';
import { MigrationService } from '../../../shared/services/migration.service';
import { RouterService } from '../../../shared/services/router.service';

@Component({
  selector: 'migrate-account',
  templateUrl: 'migrate-account.html'
})
export class MigrateAccountPage {

  private userData: UserSignUpModel = new UserSignUpModel({});

  data: any = {};
  showEmailField: boolean;

  constructor(private accountService: AccountService,
              private alertCtrl: AlertController,
              private layoutCtrl: LayoutController,
              private loadingCtrl: LoadingController,
              private router: RouterService,
              private migrationService: MigrationService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.userData = data['userData'];

      if (!this.userData) {
        this.router.navigateToRoot();
      }

      this.showEmailField = !this.userData.Email;
    });

    this.layoutCtrl.configure({
      'showHeader': false,
      'showFooter': false
    });
  }

  submit(form) {
    if (!form.valid) {
      let alert = this.alertCtrl.create({
        title: 'Error occurred',
        subTitle: 'You have errors to correct',
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    this.accountService.signUp(this.userData)
      .subscribe(
        () => {
          this.migrationService.migrateUserData()
            .subscribe(
              res => {
                this.router.navigate(['/my-cigars']);
                loading.dismiss();
              },
              err => {
                this.router.navigateToRoot();
                loading.dismiss();
              }
            );
        },
        (res) => {
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(res),
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }
}
