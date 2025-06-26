/* Core Dependencies */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { UserService } from '@server/modules/user/user.service';
/* Local Dependencies */
import { OrchardAuthToken, JwtPayload, RefreshTokenPayload } from './auth.types';

@Injectable()
export class AuthService {

    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private userService: UserService,
    ) {}

    async getToken(pass: string): Promise<OrchardAuthToken> {
        const user = await this.userService.getUser();
        const admin_pass = this.configService.get('server.pass');
        if (admin_pass !== pass) throw new UnauthorizedException();
        const access_payload: JwtPayload = { 
            sub: user.id, 
            username: user.name,
            type: 'access'
        };
        const refresh_payload: RefreshTokenPayload = { 
            sub: user.id, 
            username: user.name,
            type: 'refresh'
        };
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(access_payload, { expiresIn: '15m' }),
            this.jwtService.signAsync(refresh_payload, { expiresIn: '7d' })
        ]);
        return {
            access_token,
            refresh_token,
        };
    }

    async refreshToken(refresh_token: string): Promise<OrchardAuthToken> {
        try {
            const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refresh_token);
            if (payload.type !== 'refresh') throw new UnauthorizedException('Invalid token type');
            const user = await this.userService.getUser();
            const access_payload: JwtPayload = { 
                sub: user.id, 
                username: user.name,
                type: 'access'
            };
            const new_refresh_payload: RefreshTokenPayload = { 
                sub: user.id, 
                username: user.name,
                type: 'refresh'
            };
            const [new_access_token, new_refresh_token] = await Promise.all([
                this.jwtService.signAsync(access_payload, { expiresIn: '15m' }),
                this.jwtService.signAsync(new_refresh_payload, { expiresIn: '7d' })
            ]);
            return {
                access_token: new_access_token,
                refresh_token: new_refresh_token,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}