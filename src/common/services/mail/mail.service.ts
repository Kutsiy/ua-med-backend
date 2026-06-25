import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

interface SendActivationEmailParams {
  email: string;
  activationLink: string;
  userName?: string;
}

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendActivationEmail({
    email,
    activationLink,
    userName,
  }: SendActivationEmailParams): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Activate your UaMed account',
      template: 'account-activation',
      context: {
        userName: userName ?? 'User',
        activationLink: `${this.configService.getOrThrow('ORIGIN_URL')}/auth/activate?token=${activationLink}`,
      },
    });
  }
}
