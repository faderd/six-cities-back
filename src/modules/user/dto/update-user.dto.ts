import { IsEnum, IsString } from 'class-validator';
import { UserType } from '../../../types/user-type.enum.js';

export default class UpdateUserDto {
  public avatarPath?: string;

  @IsEnum(UserType, { message: 'userType field must be is valid' })
  public userType?: UserType;

  @IsString({ message: 'name must be an string' })
  public name?: string;
}
