/* Core Dependencies */
import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ConfigService} from '@nestjs/config';
/* Vendor Dependencies */
import {ExtractJwt, Strategy} from 'passport-jwt';
/* Native Dependencies */
import {JwtPayload} from '@server/modules/auth/auth.types';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('server.jwt_secret'),
			passReqToCallback: true,
		});
	}

	async validate(req: any, payload: JwtPayload) {
		const auth_token = req.get('Authorization').replace('Bearer', '').trim();
		return {
			id: payload.sub,
			name: payload.username,
			role: payload.role,
			auth_token,
		};
	}
}
