import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PasswordRequirements } from '../../../const.js';
import { UserType } from '../../../types/user-type.enum.js';

export default class CreateUserDto {
  @IsString({ message: 'name must be an string' })
  public name!: string;

  @IsEmail({}, { message: 'email must be valid address' })
  public email!: string;

  @IsString({ message: 'password is required' })
  @MinLength(PasswordRequirements.MIN_LENGTH, {
    message: `Minimum password length must be ${PasswordRequirements.MIN_LENGTH}`,
  })
  @MaxLength(PasswordRequirements.MAX_LENGTH, {
    message: `Maximum password length must be ${PasswordRequirements.MAX_LENGTH}`,
  })
  public password!: string;

  @IsEnum(UserType, { message: 'userType field must be is valid' })
  public userType!: UserType;
}
