// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
/* Vendor Dependencies */
import { ExtractJwt, Strategy } from 'passport-jwt';
/* Local Dependencies */
import { JwtPayload } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('server.pass'),
        });
    }

    async validate(payload: JwtPayload) {
        return { id: payload.sub, name: payload.username };
    }
}