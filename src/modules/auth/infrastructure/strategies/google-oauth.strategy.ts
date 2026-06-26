import googleOauthConfig from '@common/config/google-oauth.config';
import { Inject, Injectable } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { OAuthService } from '@modules/auth/services';
import { Profile } from 'passport';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfig: ConfigType<typeof googleOauthConfig>,
    private readonly oAuthService: OAuthService,
  ) {
    super({
      clientID: googleConfig.clientId,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;
    const firstName = profile.name?.givenName;
    const secondName = profile.name?.familyName;

    if (!email) {
      throw new Error('Google profile does not contain email');
    }

    const user = await this.oAuthService.checkOrCreateGoogleUser({
      email,
      firstName: firstName ?? '',
      secondName: secondName ?? '',
      provider: profile.provider,
      providerAccountId: profile.id,
    });
    return user;
  }
}
