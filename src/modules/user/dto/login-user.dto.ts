import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { PasswordRequirements } from '../../../const.js';

export default class LoginUserDto {
  @IsEmail({}, { message: 'email must be valid address' })
  public email!: string;

  @IsString({ message: 'password is required' })
  @MinLength(PasswordRequirements.MIN_LENGTH, { message: `Minimum password length must be ${PasswordRequirements.MIN_LENGTH}` })
  @MaxLength(PasswordRequirements.MAX_LENGTH, { message: `Maximum password length must be ${PasswordRequirements.MAX_LENGTH}` })
  public password!: string;
}
