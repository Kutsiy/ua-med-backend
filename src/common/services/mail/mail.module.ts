import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          transport: {
            host: config.getOrThrow<string>('MAIL_HOST'),
            port: Number(config.getOrThrow<string>('MAIL_PORT')),
            auth: {
              user: config.getOrThrow('GMAIL_USER'),
              pass: config.getOrThrow('GMAIL_PASS'),
            },
          },
          defaults: {
            from: config.getOrThrow<string>('MAIL_FROM'),
          },
          template: {
            adapter: new HandlebarsAdapter(),
            dir: join(process.cwd(), 'src/common/services/mail/templates'),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
