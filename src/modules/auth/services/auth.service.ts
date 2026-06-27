import { UserService } from '@modules/user/services';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { HashService, MailService, TokenService } from '@common/services';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import {
  IAuthLoginInput,
  IAuthLogOutInput,
  IAuthSignUpInput,
  IAuthRefreshTokensInput,
  IAuthAddPassword,
} from './inputs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
    private readonly mailService: MailService,
    private readonly hashService: HashService,
  ) {}

  private async sendActivationEmail(user: {
    email: string;
    firstName: string;
    activationLink: string | null;
    isActive: boolean;
  }) {
    if (!user.activationLink || user.isActive) {
      return;
    }

    try {
      await this.mailService.sendActivationEmail({
        email: user.email,
        userName: user.firstName,
        link: user.activationLink,
      });
    } catch (error) {
      this.logger.warn(
        'Failed to send activation email',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  private async genAndAddToken(user: { id: string; email: string }) {
    const tokens = await this.tokenService.signTokensAsync(
      {
        sub: user.id,
        email: user.email,
        role: 'role',
      },
      { sub: user.id, tokenId: 'tokenId' },
    );

    await this.authRefreshTokenService.addToken({
      token: tokens.refresh_token,
      userId: user.id,
    });
    return tokens;
  }

  async validateUserByEmail(email: string) {
    return this.userService.getUserByEmail(email);
  }

  async validateUserById(id: string) {
    return this.userService.getUserById(id);
  }

  async login(loginInput: IAuthLoginInput) {
    const user = await this.validateUserByEmail(loginInput.email);

    if (!user?.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashService.comparePasswords(
      loginInput.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.genAndAddToken(user);
    await this.sendActivationEmail(user);

    return {
      tokens,
      user,
    };
  }

  async signUp(signUpInput: IAuthSignUpInput) {
    const existingUser = await this.validateUserByEmail(signUpInput.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashService.hashPassword(signUpInput.password);

    const user = await this.userService.createUser({
      ...signUpInput,
      password: hashedPassword,
      activationLink: crypto.randomUUID(),
    });
    const tokens = await this.genAndAddToken(user);

    await this.sendActivationEmail(user);

    return {
      tokens,
      user,
    };
  }

  async logOut(logOutInput: IAuthLogOutInput) {
    await this.authRefreshTokenService.closeUserTokens(logOutInput.userId);
  }

  async refreshTokens(refreshTokenInput: IAuthRefreshTokensInput) {
    const { refresh_token: refreshToken, user: tokenUser } = refreshTokenInput;

    await this.tokenService.verifyRefreshTokenAsync(refreshToken);

    const storedToken = await this.authRefreshTokenService.findValidToken(refreshToken);
    if (!storedToken || storedToken.userId !== tokenUser.id) {
      throw new UnauthorizedException();
    }

    await this.authRefreshTokenService.closeTokenByToken(refreshToken);

    const user = await this.userService.getUserById(tokenUser.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.genAndAddToken(user);
    return {
      tokens,
      user,
    };
  }

  async addPassword(addPasswordInput: IAuthAddPassword) {
    const user = await this.userService.getUserByEmail(addPasswordInput.email);
    if (!user) {
      throw new NotFoundException();
    }

    const passwordHash = await this.hashService.hashPassword(addPasswordInput.newPassword);

    if (user.password) {
      if (!addPasswordInput.oldPassword) {
        throw new BadRequestException('Old password is required');
      }

      const isOldPasswordValid = await this.hashService.comparePasswords(
        addPasswordInput.oldPassword,
        user.password,
      );
      if (!isOldPasswordValid) {
        throw new BadRequestException('Invalid credentials');
      }

      const isSamePassword = await this.hashService.comparePasswords(
        addPasswordInput.newPassword,
        user.password,
      );
      if (isSamePassword) {
        throw new BadRequestException('New password must be different from the current password');
      }

      await this.userService.updateUserByEmail(addPasswordInput.email, {
        password: passwordHash,
      });
      return;
    }

    await this.userService.updateUserByEmail(addPasswordInput.email, {
      password: passwordHash,
    });
  }
}
