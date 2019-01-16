import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { KnowledgeModel } from '../../models/knowledge.model';
import { SocketMessageModel } from '../../models/socket-message.model';
import { KnowledgeDbResource } from '../../resources/db/knowledge-db.resource';
import { KnowledgeResource } from '../../resources/knowledge.resource';
import { BaseSocketEventHandler } from './base.socket-event-handler';
import { SocketEventHandlerInterface } from './socket-event-handler.interface';

@Injectable()
export class KnowledgeSocketEventHandler extends BaseSocketEventHandler implements SocketEventHandlerInterface {

  constructor(
    private dbResource: KnowledgeDbResource,
    private knowledgeResource: KnowledgeResource,
    protected zone: NgZone
  ) {
    super(zone);
    this.resourceName = 'Knowledge';
  }

  created(socketMessage: SocketMessageModel) {
    let knowledgeItem = new KnowledgeModel(socketMessage.Data);

    // Ignore the message if ContentId is not defined
    if (!knowledgeItem.ContentId) {
      return new Observable((o: Observer<any>) => {
        o.next({});
        return o.complete();
      });
    }

    return this._update(
      this.dbResource.updateCollectionItem({ContentId: knowledgeItem.ContentId}, true),
      this.knowledgeResource.localUpdate.bind(this.knowledgeResource),
      knowledgeItem
    );
  }

  deleted(socketMessage: SocketMessageModel) {
    return this._update(
      this.dbResource.deleteCollectionItem({ContentId: socketMessage.Id}),
      this.knowledgeResource.localDelete.bind(this.knowledgeResource),
      {ContentId: socketMessage.Id}
    );
  }

  updated(socketMessage: SocketMessageModel) {
    let knowledgeItem = new KnowledgeModel(socketMessage.Data);

    // Ignore the message if ContentId is not defined
    if (!knowledgeItem.ContentId) {
      return new Observable((o: Observer<any>) => {
        o.next({});
        return o.complete();
      });
    }

    return this._update(
      this.dbResource.updateCollectionItem({ContentId: knowledgeItem.ContentId}, true),
      this.knowledgeResource.localUpdate.bind(this.knowledgeResource),
      knowledgeItem
    );
  }

}
