import {inject, injectable} from 'inversify';
import {AuthService} from './auth-service.interface.js';
import {UserEntity} from '../user/index.js';
import {LoginUserDto} from '../user/dto/login-user.dto.js';
import {Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {UserService} from '../user/types/user-service.interface.js';
import {Config, RestSchema} from '../../libs/config/index.js';
import * as crypto from 'node:crypto';
import {TokenPayload} from './types/token-payload.js';
import {SignJWT} from 'jose';
import {Jwt} from './auth.constant.js';
import {UserIncorrectPasswordException, UserNotFoundException} from '../../libs/rest/index.js';

@injectable()
class DefaultAuthService implements AuthService {

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.RestConfig) private readonly config: Config<RestSchema>
  ) {
  }

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({alg: Jwt.ALGORITHM})
      .setIssuedAt()
      .setExpirationTime(Jwt.EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);

    if(!user) {
      this.logger.warn(`User with email: ${dto.email} not found`);
      throw new UserNotFoundException;
    }

    if(!user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserIncorrectPasswordException;
    }

    return user;
  }

}

export {DefaultAuthService};
