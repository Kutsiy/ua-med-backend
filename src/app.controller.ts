import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  constructor(
    @InjectPinoLogger(AppController.name)
    private readonly logger: PinoLogger,
    private readonly appService: AppService,
  ) {}

  @ApiTags('Auth')
  @Get()
  getHello(): string {
    this.logger.info('Message');
    return this.appService.getHello();
  }
}
