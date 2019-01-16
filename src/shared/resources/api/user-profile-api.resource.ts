import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BaseApiResource } from './base-api.resource';
import { UserProfileModel } from '../../models/user-profile.model';
import { UserListModel } from '../../models/user-list.model';
import { SocialPostModel } from '../../models/social-post.model';
import { HumidorModel } from '../../models/humidor.model';
import { UserReviewModel } from '../../models/user-review.model';


@Injectable()
export class UserProfileApiResource extends BaseApiResource {

  constructor(private apiService: ApiService) {
    super();
  }

  public getUserProfile(id, userType) {
    return this.apiService.get(`social/${userType}/${id}`)
      .map(
        res => this._mapItem(UserProfileModel, res.json())
      );
  }

  public getUserList(id, list, userType) {
    return this.apiService.get(`social/${userType}/${id}/cigarlogs/list/${list}`)
      .map(
        res => this._mapCollection(UserListModel, res.json())
      );
  }

  public getUserHumidors(id, userType) {
    return this.apiService.get(`social/${userType}/${id}/humidors`)
      .map(
        res => this._mapCollection(HumidorModel, res.json())
      );
  }

  public getUserPosts(id, userType) {
    let user = userType == 'users' ? `AuthorUserId=${id}` : `AuthorUUID=${id}`;
    return this.apiService.get(`social/posts?${user}`)
      .map(
        res => this._mapCollection(SocialPostModel, res.json())
      );
  }

  public getUserReviews(id, userType) {
    return this.apiService.get(`social/${userType}/${id}/reviews`)
      .map(
        res => this._mapCollection(UserReviewModel, res.json())
      );
  }

  public getUserFollows(id, userType, take, skip) {
    let queryParams = {
      take: take,
      skip: skip,
    } as any;

    queryParams = this._encodeQueryParams(queryParams);

    return this.apiService.get(`social/${userType}/${id}/profiles?${queryParams}`)
      .map(res => res.json());
  }
}

