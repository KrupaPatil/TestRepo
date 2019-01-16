import { BaseModel } from './base.model';

export class UserEditModel extends BaseModel {
  Email: string;
  Password: string;
  NewPassword: string;
  NewPasswordConfirmation: string;
  FirstName: string;
  LastName: string;
  Nickname: string;
}
