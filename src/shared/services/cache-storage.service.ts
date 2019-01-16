import { Injectable } from '@angular/core';

@Injectable()
export class CacheStorageService {

  /**
   * Clear browser cache storage.
   */
  clear() {
    return caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        return caches.delete(key);
      }));
    });
  }

}
