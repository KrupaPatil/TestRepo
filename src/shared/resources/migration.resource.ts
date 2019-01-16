import { Injectable } from '@angular/core';
import { MigrationApiResource } from './api/migration-api.resource';

@Injectable()
export class MigrationResource {

  constructor(private api: MigrationApiResource) {
  }

  public migrate(user) {
    return this.api.migrate(user);
  }

}
