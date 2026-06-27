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
      throw new BadRequestException('Invalid or expired activation link');
    }
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
    } catch (error) {
      this.logger.error(
        'Failed to send password reset email',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw error;
    }
  }

  async changePassword(newPass: string, passLink: string) {
    const user = await this.userService.getUserWhere({ passLink });
    if (!user) {
      throw new BadRequestException('Invalid or expired password reset link');
    }

    if (!user.passLinkExpAt || user.passLinkExpAt < new Date()) {
      await this.userService.updateUserByEmail(user.email, {
        passLinkExpAt: null,
        passLink: null,
      });

      throw new BadRequestException('Invalid or expired password reset link');
    }

    const passwordHash = await this.hashService.hashPassword(newPass);
    await this.userService.updateUserByEmail(user.email, {
      password: passwordHash,
      passLinkExpAt: null,
      passLink: null,
    });
  }
}
