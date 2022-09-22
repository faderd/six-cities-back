import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { UserType } from '../../types/user-type.enum.js';
import { User } from '../../types/user.type.js';
import { createSHA256 } from '../../utils/common.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.avatarPath = data.avatarPath;
    this.userType = data.userType;
  }

  @prop({
    type: String,
    required: true,
    minlength: [1, 'Min length for name is 1'],
  })
  public name!: string;

  @prop({
    type: String,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
    required: true,
  })
  public email!: string;

  @prop({
    type: String,
    match: [/\.(?:jpg|png)$/i, 'Allowed file types: .jpg, .png'],
    default: '../../img/avatar.svg',
  })
  public avatarPath!: string;

  @prop({
    type: String,
    required: true,
    default: '',
  })
  private password!: string;

  @prop({
    type: () => String,
    required: true,
    enum: UserType,
  })
  public userType!: UserType;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
