import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IJwtStategy } from '@modules/auth/domain';
import { AuthService } from '@modules/auth/services';

export class JwtStrategy extends PassportStrategy(Strategy) implements IJwtStategy {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  async validate(email: string) {
    return await this.authService.validateUser(email);
  }
}
