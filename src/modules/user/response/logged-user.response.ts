import { Expose } from 'class-transformer';

export default class LoggedUserResponse {
  @Expose()
  public id!: string;

  @Expose()
  public token!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarPath!: string;
}
