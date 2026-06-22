import { UserService } from '@modules/user/services';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly saltOrRounds = 10;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  private hashPassword(password: string) {
    return bcrypt.hash(password, this.saltOrRounds);
  }

  private comparePasswords(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return;
  }
}
