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
import { AccessControlService } from '@modules/access-control';
import { AccountMapper } from './mappers';
import { IAccountsOutput } from './outputs';

@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);

  constructor(
    private readonly userService: UserService,
    @Inject(OAUTH_ACCOUNT_REPO) private readonly oAuthAccountRepository: IOAuthAccountRepository,
    private readonly tokenService: TokenService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
    private readonly mailService: MailService,
    private readonly accessControlService: AccessControlService,
  ) {}

  async checkOrCreateGoogleUser(googleOauthInput: IGoogleOAuthInput) {
    const existingUser = await this.userService.getUserByEmail(googleOauthInput.email);
    if (existingUser) {
      this.logger.log(
        `OAuth login: existing user, userId=${existingUser.id}, provider=${googleOauthInput.provider}`,
      );
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

      await this.accessControlService.assingDefaultRoleToUser(user.id);

      await this.oAuthAccountRepository.createAccount(
        OAuthAccountEntity.create({
          provider: googleOauthInput.provider,
          providerAccountId: googleOauthInput.providerAccountId,
          userId: user.id,
        }),
      );

      this.logger.log(
        `OAuth user created: userId=${user.id}, provider=${googleOauthInput.provider}`,
      );
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        const user = await this.userService.getUserByEmail(googleOauthInput.email);
        if (user) {
          this.logger.log(
            `OAuth login: resolved race condition, userId=${user.id}, provider=${googleOauthInput.provider}`,
          );
          return user;
        }
      }

      this.logger.error(
        `OAuth user creation failed: provider=${googleOauthInput.provider}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async getOAuthUser(userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      this.logger.warn(`OAuth callback failed: user not found, userId=${userId}`);
      throw new UnauthorizedException();
    }

    const tokens = await this.tokenService.signTokensAsync(
      {
        email: user.email,
        sub: user.id,
        role: '',
      },
      { sub: user.id },
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
      } catch {
        this.logger.warn(`Failed to send activation email after OAuth login: userId=${user.id}`);
      }
    }

    this.logger.log(`OAuth login completed: userId=${user.id}`);
    return {
      tokens,
      user,
    };
  }

  async getAllAccountsByUserId(userId: string): Promise<IAccountsOutput[]> {
    this.logger.log(`Find all user accounts by id, userId=${userId}`);
    const accounts = await this.oAuthAccountRepository.getAllAccountsByUserId(userId);

    return accounts.map((account) => AccountMapper.toOutput(account));
  }
}
