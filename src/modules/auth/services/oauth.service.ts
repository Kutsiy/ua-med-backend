import { UserService } from '@modules/user/services';
import { Injectable } from '@nestjs/common';
import { IGoogleOAuthInput } from '@modules/auth/services';

@Injectable()
export class OAuthService {
  constructor(private readonly userService: UserService) {}

  async checkOrCreateGoogleUser(googleOauthInput: IGoogleOAuthInput) {
    const user = await this.userService.getUserByEmail(googleOauthInput.email);
    if (!user)
      return await this.userService.createUser({
        ...googleOauthInput,
        password: null,
        phoneNumber: null,
        middleName: null,
      });
    return user;
  }
}
