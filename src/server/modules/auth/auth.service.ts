/* Core Dependencies */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { UserService } from '@server/modules/user/user.service';
/* Local Dependencies */
import { OrchardAuthToken } from './auth.types';
import { JwtPayload } from './auth.types';

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
        const payload : JwtPayload = { sub: user.id, username: user.name };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}