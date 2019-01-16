import { BaseModel } from './base.model';

export class SettingsModel extends BaseModel {
  AutoPostReviews: boolean;
  AutoPostScans: boolean;
  DisplayRealName: boolean;
  NotifyAboutComments: boolean;
  NotifyAboutLikes: boolean;
  NotifyAboutNewFollowers: boolean;
  ShareFavorites: string;
  ShareHumidorContent: string;
  ShareHumidorValue: string;
  ShareJournal: string;
  ShareWishList: string;
  TemperatureUnit: string;
  UUID: string;
  UserId: string;
}
