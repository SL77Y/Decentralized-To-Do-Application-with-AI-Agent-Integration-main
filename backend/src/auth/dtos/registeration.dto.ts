import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(20, { message: 'Password cannot exceed 20 characters.' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password cannot be empty.' })
  @Match('password', { message: 'Confirm password must match the password.' }) // Custom decorator
  confirm_password: string;

  @IsString()
  @IsNotEmpty({ message: 'Wallet address cannot be empty.' })
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'Please provide a valid Ethereum wallet address.',
  })
  wallet_address: string;
}
