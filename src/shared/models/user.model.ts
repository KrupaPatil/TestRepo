import { BaseModel } from './base.model';

export class UserModel extends BaseModel {
  Id: string;
  Email: string;
  FirstName: string;
  LastName: string;
  Nickname: string;
  AvatarUrl: string;
  BackofficeUserId: number;
  IsDeleted: boolean;
  IsWebsiteLogin: boolean;
  MemberId: string;
  Roles;
  UserName: string;
  Followed: boolean;
}
