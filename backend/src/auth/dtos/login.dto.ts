import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Wallet address cannot be empty.' })
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'Please provide a valid Ethereum wallet address.',
  })
  wallet_address: string;
}
