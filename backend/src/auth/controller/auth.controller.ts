import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterDto } from '../dtos/registeration.dto';
import { LoginDto } from '../dtos/login.dto';
import { IAuthResponse } from '../types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * @param dto - Registration data including email, password, and wallet address
   * @returns Authentication response containing tokens and user info
   */
  @Post('register')
  register(@Body() registrationDetails: RegisterDto): Promise<IAuthResponse> {
    return this.authService.register({
      ...registrationDetails,
      firstName: registrationDetails.first_name,
      lastName: registrationDetails.last_name,
      confirmPassword: registrationDetails.confirm_password,
      walletAddress: registrationDetails.wallet_address,
    });
  }

  /**
   * Authenticate user login
   * @param dto - Login credentials (email and password)
   * @returns Authentication response containing tokens and user info
   */
  @Post('login')
  login(@Body() data: LoginDto): Promise<IAuthResponse> {
    return this.authService.login(data);
  }
}
