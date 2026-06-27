import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

interface SendEmailParams {
  email: string;
  link: string;
  userName?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendActivationEmail({ email, link, userName }: SendEmailParams): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Activate your UaMed account',
        template: 'account-activation',
        context: {
          userName: userName ?? 'User',
          activationLink: `${this.configService.getOrThrow('MAIN_URL')}/auth/activate?link=${link}`,
        },
      });
    } catch (error) {
      this.logger.error(
        'Failed to send activation email',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new InternalServerErrorException('Unable to send activation email');
    }
  }

  async sendChangePasswordEmail({ email, link, userName }: SendEmailParams): Promise<void> {
    const originUrl = this.configService.getOrThrow<string>('ORIGIN_URL');
    const resetPasswordLink = `${originUrl}/reset-password?token=${link}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Change your UaMed password',
        template: 'change-password',
        context: {
          userName: userName ?? 'User',
          resetPasswordLink,
        },
      });
    } catch (error) {
      this.logger.error(
        'Failed to send password reset email',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new InternalServerErrorException('Unable to send password reset email');
    }
  }
}
