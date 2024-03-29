import { ForbiddenException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { FastifyRequest as Request } from 'fastify';
import { ExtractJwt } from 'passport-jwt';

import { Configure } from '@/modules/config/configure';
import { getTime } from '@/modules/core/helpers';

import { RegisterDto, UpdatePasswordDto } from '../dtos';
import { UserEntity } from '../entities/user.entity';
import { RegisteredEvent } from '../events/registered.event';
import { decrypt, getUserConfig } from '../helpers';

import { UserRepository } from '../repositories';
import { UserConfig } from '../types';

import { TokenService } from './token.service';

import { UserService } from './user.service';

/**
 * 账户与认证服务
 */
@Injectable()
export class AuthService {
    constructor(
        protected configure: Configure,
        protected userService: UserService,
        protected tokenService: TokenService,
        protected userRepository: UserRepository,
        protected readonly eventEmitter: EventEmitter2,
    ) {}

    /**
     * 用户登录验证
     * @param credential
     * @param password
     */
    async validateUser(credential: string, password: string) {
        const user = await this.userService.findOneByCredential(credential, async (query) =>
            query.addSelect('user.password'),
        );
        if (user && decrypt(password, user.password)) {
            return user;
        }
        return false;
    }

    /**
     * 登录用户,并生成新的token和refreshToken
     * @param user
     */
    async login(user: UserEntity) {
        const now = await getTime(this.configure);
        const { accessToken } = await this.tokenService.generateAccessToken(user, now);
        return accessToken.value;
    }

    /**
     * 注销登录
     * @param req
     */
    async logout(req: Request) {
        const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req as any);
        if (accessToken) {
            await this.tokenService.removeAccessToken(accessToken);
        }

        return {
            msg: 'logout_success',
        };
    }

    /**
     * 登录用户后生成新的token和refreshToken
     * @param id
     */
    async createToken(id: string) {
        const now = await getTime(this.configure);
        let user: UserEntity;
        try {
            user = await this.userService.detail(id);
        } catch (error) {
            throw new ForbiddenException();
        }
        const { accessToken } = await this.tokenService.generateAccessToken(user, now);
        return accessToken.value;
    }

    /**
     * 使用用户名密码注册用户
     * @param data
     */
    async register(data: RegisterDto) {
        const { username, nickname, password } = data;
        const user = await this.userService.create({
            username,
            nickname,
            password,
            actived: true,
        } as any);

        this.eventEmitter.emit(
            'user.registed',
            new RegisteredEvent({
                userId: user.id,
            }),
        );

        return this.userService.findOneByCondition({ id: user.id });
    }

    /**
     * 更新用户密码
     * @param user
     * @param param1
     */
    async updatePassword(user: UserEntity, { password, oldPassword }: UpdatePasswordDto) {
        const item = await this.userRepository.findOneOrFail({
            select: ['password'],
            where: { id: user.id },
        });
        if (decrypt(item.password, oldPassword))
            throw new ForbiddenException('old password not matched');
        item.password = password;
        await this.userRepository.save(item);
        return this.userService.findOneByCondition({ id: item.id });
    }

    /**
     * 导入Jwt模块
     */
    static jwtModuleFactory(configure: Configure) {
        return JwtModule.registerAsync({
            useFactory: async () => {
                const config = await getUserConfig<UserConfig>(configure);
                return {
                    secret: config.jwt.secret,
                    ignoreExpiration: !configure.env.isProd(),
                    signOptions: { expiresIn: `${config.jwt.token_expired}s` },
                };
            },
        });
    }
}
