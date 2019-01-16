import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JOURNAL_LIST } from '../models/journal-item.model';
import { FAVORITES_LIST } from '../models/favorites-item.model';
import { JournalData } from '../data/journal.data';
import { FavoritesData } from '../data/favorites.data';
import { WishListData } from '../data/wish-list.data';

@Injectable()
export class CigarListItemResolver implements Resolve<any> {

  constructor(
    private journalData: JournalData,
    private favoritesData: FavoritesData,
    private wishlistData: WishListData,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const list = route.params['List'];
    const id = route.params['ItemId'];

    if (JOURNAL_LIST === list) {
      return this.journalData.get(id);
    } else if (FAVORITES_LIST === list) {
      return this.favoritesData.get(id);
    } else {
      return this.wishlistData.get(id);
    }
  }
}
