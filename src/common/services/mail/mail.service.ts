import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

interface SendEmailParams {
  email: string;
  link: string;
  userName?: string;
}

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendActivationEmail({ email, link, userName }: SendEmailParams): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Activate your UaMed account',
      template: 'account-activation',
      context: {
        userName: userName ?? 'User',
        activationLink: `${this.configService.getOrThrow('MAIN_URL')}/auth/activate?link=${link}`,
      },
    });
  }

  async sendChangePasswordEmail({ email, link, userName }: SendEmailParams) {
    const originUrl = this.configService.getOrThrow<string>('ORIGIN_URL');
    const resetPasswordLink = `${originUrl}/reset-password?token=${link}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Change your UaMed password',
      template: 'change-password',
      context: {
        userName: userName ?? 'User',
        resetPasswordLink,
      },
    });
  }
}
