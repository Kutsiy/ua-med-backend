import { UserService } from '@modules/user/services';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IAuthLoginInput } from '@modules/auth/services';
import { TokenService } from '@common/services';

@Injectable()
export class AuthService {
  private readonly saltOrRounds = 10;

  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, this.saltOrRounds);
  }

  private async comparePasswords(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
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

    const compare = await this.comparePasswords(loginInput.password, user.password);

    if (!compare) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.tokenService.signTokensAsync(
      {
        sub: user.id,
        email: user.email,
        role: 'role',
      },
      { sub: user.id, tokenId: 'tokenId' },
    );

    return tokens;
  }
}
