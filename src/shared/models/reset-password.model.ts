import { BaseModel } from './base.model';

export class ResetPasswordModel extends BaseModel {
  Key: string;
  Token: string;
  Password: string;
  ConfirmPassword: string;
}
