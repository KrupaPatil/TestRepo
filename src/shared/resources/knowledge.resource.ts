import { Injectable, Injector } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/do';

import { KnowledgeModel } from '../models/knowledge.model';
import { KnowledgeApiResource } from './api/knowledge-api.resource';
import { BaseResource } from './base.resource';
import { KnowledgeDbResource } from './db/knowledge-db.resource';

@Injectable()
export class KnowledgeResource extends BaseResource {
  resources: [KnowledgeModel];

  constructor(db: KnowledgeDbResource,
              api: KnowledgeApiResource,
              injector: Injector) {
    super(db, api, injector);
  }

  public getList() {
    if (this.resources) return Observable.of(this.resources);

    return this._get(
      this.api.getList(),
      this.db.getCollection(),
      this.db.updateCollection()
    ).do((resources: [KnowledgeModel]) => {
      this.resources = resources;
    });
  }

  public getListItem(id) {
    return new Observable((o: Observer<KnowledgeModel>) => {
      this.getList().subscribe(
        () => {
          o.next(_.find(this.resources, {'ContentId': id} as KnowledgeModel));
          o.complete();
        },
        err => {
          o.error(err);
        }
      );
    });
  }

  public localUpdate(data) {
    if (typeof this.resources == 'undefined') {
      return;
    }

    let existing = _.find(this.resources, {'ContentId': data.ContentId});

    if (existing) {
      _.assignIn(existing, data);
    } else {
      this.resources.push(data);
    }
  }

  public localDelete(data) {
    if (typeof this.resources == 'undefined') {
      return;
    }

    _.remove(this.resources, {ContentId: data.ContentId});
  }
}
