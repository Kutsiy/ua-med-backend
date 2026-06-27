import { HashService, MailService } from '@common';
import { UserService } from '@modules/user/services';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthOtherService {
  private readonly logger = new Logger(AuthOtherService.name);

  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly mailService: MailService,
  ) {}

  async activateAccountByLink(activationLink: string) {
    const user = await this.userService.activateUser(activationLink);
    if (!user) {
      this.logger.warn('Account activation failed: invalid or expired link');
      throw new BadRequestException('Invalid or expired activation link');
    }
    this.logger.log(`Account activated: userId=${user.id}`);
    return user;
  }

  async forgotPassword(email: string) {
    const user = await this.userService.genPassLinkForUserByEmail(email);
    if (!user) {
      return;
    }

    try {
      await this.mailService.sendChangePasswordEmail({
        email: user.email,
        link: user.passLink ?? '',
        userName: user.firstName,
      });
      this.logger.log(`Password reset email initiated: userId=${user.id}`);
    } catch (error) {
      this.logger.error(`Failed to initiate password reset: userId=${user.id}`);
      throw error;
    }
  }

  async changePassword(newPass: string, passLink: string) {
    const user = await this.userService.getUserWhere({ passLink });
    if (!user) {
      this.logger.warn('Password reset failed: invalid or expired link');
      throw new BadRequestException('Invalid or expired password reset link');
    }

    if (!user.passLinkExpAt || user.passLinkExpAt < new Date()) {
      await this.userService.updateUserByEmail(user.email, {
        passLinkExpAt: null,
        passLink: null,
      });

      this.logger.warn(`Password reset failed: link expired, userId=${user.id}`);
      throw new BadRequestException('Invalid or expired password reset link');
    }

    const passwordHash = await this.hashService.hashPassword(newPass);
    await this.userService.updateUserByEmail(user.email, {
      password: passwordHash,
      passLinkExpAt: null,
      passLink: null,
    });
    this.logger.log(`Password reset completed: userId=${user.id}`);
  }
}
