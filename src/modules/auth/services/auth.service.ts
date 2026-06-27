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
    id: string;
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
    } catch {
      this.logger.warn(`Failed to send activation email: userId=${user.id}`);
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
      this.logger.warn(`Login failed: user not found, email=${loginInput.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashService.comparePasswords(
      loginInput.password,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: invalid credentials, email=${loginInput.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.genAndAddToken(user);
    await this.sendActivationEmail(user);

    this.logger.log(`User logged in successfully: userId=${user.id}`);
    return {
      tokens,
      user,
    };
  }

  async signUp(signUpInput: IAuthSignUpInput) {
    const existingUser = await this.validateUserByEmail(signUpInput.email);
    if (existingUser) {
      this.logger.warn(`Sign up failed: user already exists, email=${signUpInput.email}`);
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

    this.logger.log(`User signed up successfully: userId=${user.id}`);
    return {
      tokens,
      user,
    };
  }

  async logOut(logOutInput: IAuthLogOutInput) {
    await this.authRefreshTokenService.closeUserTokens(logOutInput.userId);
    this.logger.log(`User logged out successfully: userId=${logOutInput.userId}`);
  }

  async refreshTokens(refreshTokenInput: IAuthRefreshTokensInput) {
    const { refresh_token: refreshToken, user: tokenUser } = refreshTokenInput;

    await this.tokenService.verifyRefreshTokenAsync(refreshToken);

    const storedToken = await this.authRefreshTokenService.findValidToken(refreshToken);
    if (!storedToken || storedToken.userId !== tokenUser.id) {
      this.logger.warn(`Refresh token failed: invalid or expired token, userId=${tokenUser.id}`);
      throw new UnauthorizedException();
    }

    await this.authRefreshTokenService.closeTokenByToken(refreshToken);

    const user = await this.userService.getUserById(tokenUser.id);
    if (!user) {
      this.logger.warn(`Refresh token failed: user not found, userId=${tokenUser.id}`);
      throw new UnauthorizedException();
    }

    const tokens = await this.genAndAddToken(user);
    this.logger.log(`Refresh token rotated successfully: userId=${user.id}`);
    return {
      tokens,
      user,
    };
  }

  async addPassword(addPasswordInput: IAuthAddPassword) {
    const user = await this.userService.getUserByEmail(addPasswordInput.email);
    if (!user) {
      this.logger.warn(`Password change failed: user not found, email=${addPasswordInput.email}`);
      throw new NotFoundException();
    }

    const passwordHash = await this.hashService.hashPassword(addPasswordInput.newPassword);

    if (user.password) {
      if (!addPasswordInput.oldPassword) {
        this.logger.warn(`Password change failed: old password required, userId=${user.id}`);
        throw new BadRequestException('Old password is required');
      }

      const isOldPasswordValid = await this.hashService.comparePasswords(
        addPasswordInput.oldPassword,
        user.password,
      );
      if (!isOldPasswordValid) {
        this.logger.warn(`Password change failed: invalid credentials, userId=${user.id}`);
        throw new BadRequestException('Invalid credentials');
      }

      const isSamePassword = await this.hashService.comparePasswords(
        addPasswordInput.newPassword,
        user.password,
      );
      if (isSamePassword) {
        this.logger.warn(`Password change failed: new password same as current, userId=${user.id}`);
        throw new BadRequestException('New password must be different from the current password');
      }

      await this.userService.updateUserByEmail(addPasswordInput.email, {
        password: passwordHash,
      });
      this.logger.log(`Password changed successfully: userId=${user.id}`);
      return;
    }

    await this.userService.updateUserByEmail(addPasswordInput.email, {
      password: passwordHash,
    });
    this.logger.log(`Password set successfully: userId=${user.id}`);
  }
}
