import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class EmitterService {

  detailsScreenStatus: Observable<boolean>;
  detailsScreenData: Subject<boolean>;

  socialDetailsScreentatus: Observable<boolean>;
  socialDetailsScreenData: Subject<boolean>;

  detailsWhenLineStatus: Observable<boolean>;
  detailsWhenLinenData: Subject<boolean>;

  notificationCounterStatus: Observable<number>;
  notificationCounterData: Subject<number>;

  humidorDetailsScreenStatus: Observable<boolean>;
  humidorDetailsScreenData: Subject<boolean>;

  currentUrlStatusStatus: Observable<boolean>;
  currentUrlData: Subject<boolean>;

  clearAllNotificationsStatus: Observable<boolean>;
  clearAllNotificationsData: Subject<boolean>;

  notificationNumber = 0;

  constructor() {
    this.detailsScreenData = new Subject<boolean>();
    this.detailsScreenStatus = this.detailsScreenData.asObservable();

    this.socialDetailsScreenData = new Subject<boolean>();
    this.socialDetailsScreentatus = this.socialDetailsScreenData.asObservable();

    this.detailsWhenLinenData = new Subject<boolean>();
    this.detailsWhenLineStatus = this.detailsWhenLinenData.asObservable();

    this.notificationCounterData = new Subject<number>();
    this.notificationCounterStatus = this.notificationCounterData.asObservable();

    this.humidorDetailsScreenData = new Subject<boolean>();
    this.humidorDetailsScreenStatus = this.humidorDetailsScreenData.asObservable();

    this.currentUrlData = new Subject<boolean>();
    this.currentUrlStatusStatus = this.currentUrlData.asObservable();

    this.clearAllNotificationsData = new Subject<boolean>();
    this.clearAllNotificationsStatus = this.clearAllNotificationsData.asObservable();
  }

  public closeDetailsScreen() {
    this.detailsScreenData.next(true);
  }

  public socialDetailsScreen(value) {
    this.socialDetailsScreenData.next(value);
  }

  public openDetailsWhenLine() {
    this.detailsWhenLinenData.next(true);
  }

  public changeNotificationCounter(value) {
    this.notificationNumber = value;
    this.notificationCounterData.next(value);
  }

  public increaseNotificationCounter() {
    this.notificationNumber++;
    this.notificationCounterData.next(this.notificationNumber);
  }

  public currentUrlChanged(value) {
    this.currentUrlData.next(value);
  }

  public closeHumidorDetailsScreen() {
    this.humidorDetailsScreenData.next(true);
  }

  public clearAllNotifications() {
    this.clearAllNotificationsData.next(true);
  }
}
