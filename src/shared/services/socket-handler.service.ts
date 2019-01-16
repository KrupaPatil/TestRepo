import 'expose-loader?$!jquery';
import 'expose-loader?jQuery!jquery';
import 'signalr';

import { Injectable, Injector } from '@angular/core';
import { CONFIG_API_DOMAIN } from '@app/env';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { throwError } from '../../app/app.common';
import { SocketMessageModel } from '../models/socket-message.model';
import { ActiveUserService } from './active-user.service';
import { ApiService } from './api.service';
import { DeviceService } from './device.service';
import { NetworkService } from './network.service';
import { RefreshAppService } from './refresh-app.service';
import { CigarLogSocketEventHandler } from './socket-event-handlers/cigar-log.socket-event-handler';
import { HumidorSocketEventHandler } from './socket-event-handlers/humidor.socket-event-handler';
import { HumidorInfoSocketEventHandler } from './socket-event-handlers/humidor-info.socket-event-handler';
import { KnowledgeSocketEventHandler } from './socket-event-handlers/knowledge.socket-event-handler';
import { ProductNoteSocketEventHandler } from './socket-event-handlers/product-note.socket-event-handler';
import { ProductReviewSocketEventHandler } from './socket-event-handlers/product-review.socket-event-handler';
import { ProductSocketEventHandler } from './socket-event-handlers/product.socket-event-handler';
import { SensorSocketEventHandler } from './socket-event-handlers/sensor.socket-event-handler';
import { SensorOfflineSocketEventHandler } from './socket-event-handlers/sensor-offline.socket-event-handler';
import { SocialCommentSocketEventHandler } from './socket-event-handlers/social-comment.socket-event-handler';
import { SocialPostSocketEventHandler } from './socket-event-handlers/social-post.socket-event-handler';
import { UserSocketEventHandler } from './socket-event-handlers/user.socket-event-handler';
import { StorageService } from './storage.service';

declare let $: any;

export const GLOBAL_CHANNEL = 'Global';
export const PERSONAL_CHANNEL = 'Personal';

const LAST_SYNC_TIME_KEY = 'lastSyncTime';

@Injectable()
export class SocketHandlerService {

  private handlersMapping = {
    'CigarLog':                 CigarLogSocketEventHandler,
    'Humidor':                  HumidorSocketEventHandler,
    'HumidorInfo':              HumidorInfoSocketEventHandler,
    'HumidorSensorMeasurement': SensorSocketEventHandler,
    'HumidorSensorOffline':     SensorOfflineSocketEventHandler,
    'Knowledge':                KnowledgeSocketEventHandler,
    'Cigar':                    ProductSocketEventHandler,
    'Line':                     ProductSocketEventHandler,
    'CigarRating':              ProductReviewSocketEventHandler,
    'CigarUserNote':            ProductNoteSocketEventHandler,
    'SocialPost':               SocialPostSocketEventHandler,
    'Account':                  UserSocketEventHandler,
    'SocialComment':            SocialCommentSocketEventHandler
  };

  private connection;
  private messagesQueue = [];
  private blockedMessagesQueue = [];
  private syncInProgress: boolean = false;
  private allowReconnect: boolean = true;

  constructor(private activeUserService: ActiveUserService,
              private apiService: ApiService,
              private deviceService: DeviceService,
              private injector: Injector,
              private networkService: NetworkService,
              private storageService: StorageService,
              private refreshAppService: RefreshAppService) {
  }

  public init() {
    this.initConnection();

    this.networkService.onConnect
      .subscribe(
        () => {
          if (!this.connection) {
            this.initConnection();
          } else if (
            this.connection.state === $.signalR.connectionState.disconnected
            && this.allowReconnect
          ) {
            console.log('SocketHandler: Reconneting On Network Connect');
            this.establishConnection();
          }
        });

    $(window).focus(() => {
      console.log('SocketHandler: On Focus');

      if (this.connection
        && this.connection.state === $.signalR.connectionState.disconnected
        && this.networkService.isConnected()
        && this.allowReconnect
      ) {
        console.log('SocketHandler: Reconneting On Focus');
        this.establishConnection();
      }
    });
  }

  public stop() {
    if (this.connection) {
      this.allowReconnect = false;
      this.connection.stop();
      this.connection = null;
    }
  }

  private initConnection() {
    if (this.networkService.isConnected()) {
      this.activeUserService.loadUser()
        .subscribe(
          user => {
            this.createConnection(user.Id);
          },
          () => {
            this.createConnection();
          }
        );
    }
  }

  private createConnection(userId = null) {
    this.connection = $.hubConnection(_.trimEnd(CONFIG_API_DOMAIN, '/api'));
    this.allowReconnect = true;

    let queryParams = {'UUID': this.deviceService.getDeviceID()};
    if (userId) {
      queryParams['UserId'] = userId;
    }
    this.connection.qs = queryParams;

    const syncHubProxy = this.connection.createHubProxy('Sync');
    syncHubProxy.on('SystemMessage', () => { });

    this.connection.error((error) => {
      console.error(`Web sockets connection error: ${error}`);
    });

    this.connection.reconnected(() => {
      this.syncMissedMessages();
    });

    this.connection.disconnected(() => {
      setTimeout(() => {
        if (this.connection
          && this.connection.state === $.signalR.connectionState.disconnected
          && this.networkService.isConnected()
          && this.allowReconnect
        ) {
          console.log('SocketHandler: Reconneting On Disconnected');
          this.establishConnection();
        }
      }, 5000);
    });

    this.connection.received((data) => {
      this.addMessagesToQueue(data.A);
    });

    this.establishConnection();
  }

  private establishConnection() {
    this.connection.start({transport: 'webSockets', jsonp: true}, () => {
      this.syncMissedMessages();
    });
  }

  private syncMissedMessages() {
    if (this.syncInProgress) {
      return;
    }
    this.syncStarted();

    this.storageService.get(LAST_SYNC_TIME_KEY)
      .subscribe(
        (lastSyncTime) => {
          if (lastSyncTime) {
            // if last sync is older than 3 days, refresh app
            if (this.isOlderThan(lastSyncTime, 3)) {
              this.refreshAppService.process();
            } else {
              this.apiService.get('datasync?after=' + lastSyncTime)
                .subscribe(
                  (res: any) => {
                    let data = JSON.parse(res._body);

                    if (data && data.SyncMessages) {
                      // if we receive more that 50 messages, refresh app
                      if (data.SyncMessages.length > 50) {
                        this.refreshAppService.process();
                      } else {
                        this.addMessagesToQueue(data.SyncMessages, true);
                      }
                    }

                    this.syncFinished();
                  },
                  (error) => {
                    this.syncFinished();
                  }
                );
            }
          } else {
            this.syncFinished();
            let now = new Date();
            this.saveLastSyncTime(now.toISOString());
          }
        },
        (error) => {
          this.syncFinished();
          let err = JSON.stringify(error);
          throwError(`Error getting last sync time: ${err}`);
        }
      );
  }

  private syncStarted() {
    this.syncInProgress = true;
  }

  private syncFinished() {
    this.syncInProgress = false;

    // merge messages that appeared while sync was in progress (they are stored in blockedMessagesQueue)
    this.messagesQueue = this.messagesQueue.concat(this.blockedMessagesQueue);
    this.blockedMessagesQueue = [];
  }

  private addMessagesToQueue(messages: [any], force: boolean = false) {
    if (!this.syncInProgress || force === true) {
      // We will use queue because messages needs to be processed one by one.
      _.each(messages, (msgData) => {
        this.messagesQueue.push(new SocketMessageModel(msgData));
      });

      this.processMessagesQueue();
    } else {
      // we will add messages to 'blocked' queue and merge them when sync if finished
      _.each(messages, (msgData) => {
        this.blockedMessagesQueue.push(new SocketMessageModel(msgData));
      });
    }
  }

  // recursive function to process all queue messages
  private processMessagesQueue() {
    if (!this.messagesQueue.length) return;

    let message = this.messagesQueue.shift();
    this.handleMessage(message).subscribe(
      () => {
        this.saveLastSyncTime(message.CreatedOnUTC);
        this.processMessagesQueue();
      },
      err => {
        this.refreshAppService.process();
        throwError(`Web sockets message handling error. Error ${JSON.stringify(err)} ----------- Message: ${JSON.stringify(message)}`);
      }
    );
  }

  private handleMessage(socketMessage: SocketMessageModel) {
    return new Observable((o: Observer<any>) => {
      let handler = this.handlersMapping[socketMessage.Entity] ?
        this.injector.get(this.handlersMapping[socketMessage.Entity]) : null;
      let action = socketMessage.Action.toLowerCase();

      if (handler && handler[action]) {
        handler[action](socketMessage).subscribe(
          () => {
            o.next({});
            o.complete();
          },
          (err) => {
            o.error(err);
          }
        );
      } else {
        o.error({json: () => ({Message: 'Handler not found for web socket message: ' + JSON.stringify(socketMessage)})});
      }
    });
  }

  private saveLastSyncTime(time) {
    return this.storageService.set(LAST_SYNC_TIME_KEY, time).subscribe();
  }

  private isOlderThan(lastSyncTime: string, days: number): boolean {
    let threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - days);

    return new Date(lastSyncTime) < threeDaysAgo;
  }

}
