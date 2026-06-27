import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly logger = new Logger(HashService.name);
  private readonly saltOrRounds = 10;

  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltOrRounds);
    } catch (error) {
      this.logger.error(
        'Password hashing failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Unable to process password');
    }
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      this.logger.error(
        'Password comparison failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Unable to verify password');
    }
  }
}
