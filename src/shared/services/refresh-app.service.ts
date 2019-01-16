import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RefreshAppService {

  constructor(private storage: StorageService) {
  }

  public process(reload = true) {
    return new Observable((o: Observer<boolean>) => {
      this.storage.clear()
        .subscribe(
          () => {
            o.next(true);
            o.complete();

            if (reload) {
              window.location.reload();
            }
          },
          (err) => {
            return o.error(err);
          });
    });
  }

}
