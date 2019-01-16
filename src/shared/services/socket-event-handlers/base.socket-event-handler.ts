import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

export class BaseSocketEventHandler {

  protected resourceName;
  protected zone;

  constructor(zone) {
    this.zone = zone;
  }

  /**
   * Update local database and currently loaded data.
   */
  _update(dbUpdateFn: (data: any) => any, dataStoreUpdateFn: (data: any) => any, data: any) {
    return new Observable((o: Observer<any>) => {
      dbUpdateFn(data)
        .subscribe(
          res => {
            if (dataStoreUpdateFn) {
              this.zone.run(() => {
                dataStoreUpdateFn(res);
              });
            }

            o.next({});
            return o.complete();
          },
          (err) => {
            if (err && err.status === 404) {
              // if resource not found, it haven't been loaded yet, there is no need for update
              o.next({});
              return o.complete();
            } else {
              return o.error(err);
            }
          }
        );
    });
  }

}
