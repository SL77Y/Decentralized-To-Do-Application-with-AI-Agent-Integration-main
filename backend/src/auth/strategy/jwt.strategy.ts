import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../service/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  // Validate JWT payload and find the user
  async validate(request, payload) {
    const user = await this.authService.validateUser(payload.id);
    if (!user) {
      throw new UnauthorizedException('User does not exist or is unauthorized');
    }
    request['user'] = user;
    return user;
  }
}
