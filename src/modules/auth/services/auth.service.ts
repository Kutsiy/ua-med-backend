import { UserService } from '@modules/user/services';
import {
  BadRequestException,
  Injectable,
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
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
    private readonly mailService: MailService,
    private readonly hashService: HashService,
  ) {}

  private async sendEmail(user: {
    email: string;
    firstName: string;
    activationLink: string | null;
    isActive: boolean;
  }) {
    if (user.activationLink && !user.isActive) {
      await this.mailService.sendActivationEmail({
        email: user.email,
        userName: user.firstName,
        link: user.activationLink,
      });
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
    const user = await this.userService.getUserByEmail(email);
    return user;
  }

  async validateUserById(id: string) {
    const user = await this.userService.getUserById(id);
    return user;
  }

  async login(loginInput: IAuthLoginInput) {
    const user = await this.validateUserByEmail(loginInput.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) throw new UnauthorizedException();

    const compare = await this.hashService.comparePasswords(loginInput.password, user.password);

    if (!compare) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.genAndAddToken(user);

    await this.sendEmail(user);

    return {
      tokens,
      user,
    };
  }

  async signUp(signUpInput: IAuthSignUpInput) {
    const userValidate = await this.validateUserByEmail(signUpInput.email);
    if (userValidate) {
      throw new UnauthorizedException('User not found');
    }

    const hashedPassword = await this.hashService.hashPassword(signUpInput.password);

    const user = await this.userService.createUser({
      ...signUpInput,
      password: hashedPassword,
      activationLink: crypto.randomUUID(),
    });
    const tokens = await this.genAndAddToken(user);

    await this.sendEmail(user);

    return {
      tokens,
      user,
    };
  }

  async logOut(logOutInput: IAuthLogOutInput) {
    await this.authRefreshTokenService.closeUserTokens(logOutInput.userId);
  }

  async refreshTokens(refreshTokenInput: IAuthRefreshTokensInput) {
    await this.authRefreshTokenService.closeTokenByToken(refreshTokenInput.refresh_token);
    const user = await this.userService.getUserById(refreshTokenInput.user.id);
    if (!user) throw new UnauthorizedException();
    const tokens = await this.genAndAddToken(user);
    return {
      tokens,
      user,
    };
  }

  async addPassword(addPasswordInput: IAuthAddPassword) {
    const user = await this.userService.getUserByEmail(addPasswordInput.email);
    if (!user) throw new NotFoundException();
    const passwordHash = await this.hashService.hashPassword(addPasswordInput.newPassword);
    if (user.password) {
      if (!addPasswordInput.oldPassword) throw new BadRequestException('Old password is required');
      const compare = await this.hashService.comparePasswords(
        addPasswordInput.oldPassword,
        user.password,
      );
      if (!compare) throw new BadRequestException('Something went wrong');

      const compareOldNew = await this.hashService.comparePasswords(
        addPasswordInput.newPassword,
        user.password,
      );

      if (compareOldNew)
        throw new BadRequestException('New password must be different from the current password');

      await this.userService.updateUserByEmail(addPasswordInput.email, {
        password: passwordHash,
      });
    } else {
      await this.userService.updateUserByEmail(addPasswordInput.email, {
        password: passwordHash,
      });
    }
  }
}
