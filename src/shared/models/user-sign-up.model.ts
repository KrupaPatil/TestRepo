import { BaseModel } from './base.model';

export class UserSignUpModel extends BaseModel {
  Email: string;
  Password: string;
  ConfirmPassword: string;
  FirstName: string;
  LastName: string;
  Nickname: string;
  AvatarUrl: string;
}
