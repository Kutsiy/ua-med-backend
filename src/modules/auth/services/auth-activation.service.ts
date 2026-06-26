import { HashService, MailService } from '@common';
import { UserService } from '@modules/user/services';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthOtherService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly mailService: MailService,
  ) {}

  async activateAccountByLink(activationLink: string) {
    await this.userService.activateUser(activationLink);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.genPassLinkForUserByEmail(email);
    await this.mailService.sendChangePasswordEmail({
      email: user.email,
      link: user.passLink ? user.passLink : '',
      userName: user.firstName,
    });
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
    await this.userService.updateUserByEmail(user.email, {
      password: await this.hashService.hashPassword(newPass),
      passLinkExpAt: null,
      passLink: null,
    });
  }
}
