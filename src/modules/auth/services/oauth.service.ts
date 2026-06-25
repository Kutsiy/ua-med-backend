import { UserService } from '@modules/user/services';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IGoogleOAuthInput } from './inputs';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import {
  OAUTH_ACCOUNT_REPO,
  OAuthAccountEntity,
  type IOAuthAccountRepository,
} from '@modules/auth/domain';
import { TokenService } from '@common/services';

@Injectable()
export class OAuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(OAUTH_ACCOUNT_REPO) private readonly oAuthAccountRepository: IOAuthAccountRepository,
    private readonly tokenService: TokenService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  async checkOrCreateGoogleUser(googleOauthInput: IGoogleOAuthInput) {
    const userCheck = await this.userService.getUserByEmail(googleOauthInput.email);
    if (!userCheck) {
      const user = await this.userService.createUser({
        ...googleOauthInput,
        password: null,
        phoneNumber: null,
        middleName: null,
      });
      await this.oAuthAccountRepository.createAccount(
        OAuthAccountEntity.create({
          provider: googleOauthInput.provider,
          providerAccountId: googleOauthInput.providerAccountId,
          userId: user.id,
        }),
      );
      return user;
    }
    return userCheck;
  }

  async getOAuthUser(userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    const tokens = await this.tokenService.signTokensAsync(
      {
        email: user.email,
        sub: user.id,
        role: '',
      },
      { sub: user?.id, tokenId: 'tokenId' },
    );

    await this.authRefreshTokenService.addToken({
      token: tokens.refresh_token,
      userId: user.id,
    });

    return {
      tokens,
      user,
    };
  }
}
