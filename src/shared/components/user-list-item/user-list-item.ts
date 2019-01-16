import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'user-list-item',
  templateUrl: 'user-list-item.html'
})
export class UserListItem {

  @Input() list;
  @Input() follows;

  constructor(private router: RouterService,
              private route: ActivatedRoute) {
  }

  navigateToUSerProfile(user) {
    const id = user.UserId || user.UUID;
    const userType = user.UserId ? 'users' : 'guests';

      this.router.navigate([`/social/user-profile/${userType}/${id}`]);
  }

}
