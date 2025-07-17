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
			secretOrKey: configService.get('server.pass'),
		});
	}

	async validate(payload: JwtPayload) {
		return {id: payload.sub, name: payload.username};
	}
}
