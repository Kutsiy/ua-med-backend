import { UserService } from '@modules/user/services';
import {
  Inject,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { IGoogleOAuthInput } from './inputs';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import {
  OAUTH_ACCOUNT_REPO,
  OAuthAccountEntity,
  type IOAuthAccountRepository,
} from '@modules/auth/domain';
import { MailService, TokenService } from '@common/services';

@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);

  constructor(
    private readonly userService: UserService,
    @Inject(OAUTH_ACCOUNT_REPO) private readonly oAuthAccountRepository: IOAuthAccountRepository,
    private readonly tokenService: TokenService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
    private readonly mailService: MailService,
  ) {}

  async checkOrCreateGoogleUser(googleOauthInput: IGoogleOAuthInput) {
    const existingUser = await this.userService.getUserByEmail(googleOauthInput.email);
    if (existingUser) {
      return existingUser;
    }

    try {
      const user = await this.userService.createUser({
        ...googleOauthInput,
        password: null,
        phoneNumber: null,
        middleName: null,
        activationLink: crypto.randomUUID(),
      });

      await this.oAuthAccountRepository.createAccount(
        OAuthAccountEntity.create({
          provider: googleOauthInput.provider,
          providerAccountId: googleOauthInput.providerAccountId,
          userId: user.id,
        }),
      );

      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        const user = await this.userService.getUserByEmail(googleOauthInput.email);
        if (user) {
          return user;
        }
      }

      this.logger.error(
        'Failed to create OAuth user',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw error;
    }
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
      { sub: user.id, tokenId: 'tokenId' },
    );

    await this.authRefreshTokenService.addToken({
      token: tokens.refresh_token,
      userId: user.id,
    });

    if (user.activationLink && !user.isActive) {
      try {
        await this.mailService.sendActivationEmail({
          email: user.email,
          userName: user.firstName,
          link: user.activationLink,
        });
      } catch (error) {
        this.logger.warn(
          'Failed to send activation email after OAuth login',
          error instanceof Error ? error.message : 'Unknown error',
        );
      }
    }

    return {
      tokens,
      user,
    };
  }
}
