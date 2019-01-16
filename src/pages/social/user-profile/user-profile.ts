import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutController } from '../../../shared/services/layout.controller';
import { UserProfileModel } from '../../../shared/models/user-profile.model';
import { EmitterService } from '../../../shared/services/emitter.service';
import { RouterService } from '../../../shared/services/router.service';
import { ActiveUserService } from '../../../shared/services/active-user.service';
import { SocialPostData } from '../../../shared/data/social-post.data';

@Component({
  selector: 'user-profile',
  templateUrl: 'user-profile.html'
})

export class UserProfile {

  private userProfile: UserProfileModel;
  private showFollow: boolean;
  private isFollowed: boolean;

  constructor(private layoutCtrl: LayoutController,
              private activatedRoute: ActivatedRoute,
              private socialPostData: SocialPostData,
              private activeUserService: ActiveUserService,
              private router: RouterService,
              private emitterService: EmitterService) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data: any) => {
      this.userProfile = data.UserProfile;
      this.isFollowed = !!data.UserProfile.FollowedOn;

      if (window.innerWidth > 1200) {
        this.emitterService.socialDetailsScreen(false);
      }

      const activeUserId = this.activeUserService.getID();
      this.showFollow = !(activeUserId && activeUserId == this.userProfile.UserId) ;
    });

    this.layoutCtrl.configure({
      'pageTitle': this.showUserNicknameOrName(),
      'manualBackButton': true,
      'showBackLink': false,
      'showMenuLink': false,
      'showSocialPostsGroup': false
    });


  }

  toggleFollowUser() {
    if (!this.activeUserService.isAuthenticated()) {
      this.router.navigate(['/', 'login']);
      return;
    }

    this.socialPostData.toggleFollowUser(this.userOrGuestId(), this.isFollowed).subscribe(
      () => {
        this.isFollowed = !this.isFollowed;
      },
      (err) => {}
    );
  }

  navigateToUserListings(list) {
    this.router.navigate([`./user-list/`, list, this.userOrGuestAccount(), this.userOrGuestId()], {relativeTo: this.activatedRoute});
  }

  navigateToUserPosts() {
    this.router.navigate([`./user-posts/`, this.userOrGuestAccount(), this.userOrGuestId()], {relativeTo: this.activatedRoute});
  }

  navigateToUserHumidors() {
    this.router.navigate([`./user-humidors/`, this.userOrGuestAccount(), this.userOrGuestId()], {relativeTo: this.activatedRoute});
  }

  navigateToUserReviews() {
    this.router.navigate([`./user-reviews/`, this.userOrGuestAccount(), this.userOrGuestId()], {relativeTo: this.activatedRoute});
  }

  navigateToUserFollowing() {
    if (!this.userProfile.Following) return;
    this.router.navigate([`./user-following/`, this.userOrGuestAccount(), this.userOrGuestId()], {relativeTo: this.activatedRoute});
  }

  navigateToUserFollowers() {
    if (!this.userProfile.Followers) return;
    this.router.navigate([`./user-followers/`, this.userOrGuestAccount(), this.userOrGuestId()], {relativeTo: this.activatedRoute});
  }

  showUserNicknameOrName() {
    if (!this.userProfile.UserId) return 'Guest User';
    if (this.userProfile.Nickname) return this.userProfile.Nickname;
    return (this.userProfile.FirstName + ' ' + this.userProfile.LastName);
  }

  userOrGuestAccount() {
    return this.userProfile.UserId ? 'users' : 'guests';
  }

  userOrGuestId() {
    return this.userProfile.UserId ? this.userProfile.UserId : this.userProfile.UUID
  }

  ngOnDestroy() {
    this.layoutCtrl.configure({
      'pageTitle': 'Social',
      'manualBackButton': false,
      'showMenuLink': true
    });
  }
}
