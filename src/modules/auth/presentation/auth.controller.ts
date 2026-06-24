import { GoogleOAuthGuard } from '@common';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @UseGuards(GoogleOAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleOAuthGuard)
  @Get('google/callback')
  googleCallback() {}
}
