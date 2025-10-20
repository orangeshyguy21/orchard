/* Core Dependencies */
import {Injectable, UnauthorizedException, Logger} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {UserService} from '@server/modules/user/user.service';
/* Local Dependencies */
import {OrchardAuthToken, JwtPayload, RefreshTokenPayload} from './auth.types';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	private token_ttl = 15 * 60;
	private refresh_ttl = 7 * 24 * 60 * 60;
	private blacklist: string[] = [];

	constructor(
		private configService: ConfigService,
		private jwtService: JwtService,
		private userService: UserService,
	) {}

	public async getToken(name: string, password: string): Promise<OrchardAuthToken> {
		// const user = await this.userService.getUser();
		const user = await this.userService.getUserByName(name);
		const valid = await this.userService.validatePassword(user, password);
		if (!valid) throw new UnauthorizedException('Invalid username or password');
		const access_payload: JwtPayload = {
			sub: user.id,
			username: user.name,
			type: 'access',
		};
		const refresh_payload: RefreshTokenPayload = {
			sub: user.id,
			username: user.name,
			type: 'refresh',
		};
		const [access_token, refresh_token] = await Promise.all([
			this.jwtService.signAsync(access_payload, {expiresIn: this.token_ttl}),
			this.jwtService.signAsync(refresh_payload, {expiresIn: this.refresh_ttl}),
		]);
		return {
			access_token,
			refresh_token,
		};
	}

	public async refreshToken(refresh_token: string): Promise<OrchardAuthToken> {
		try {
			if (this.blacklist.includes(refresh_token)) throw new UnauthorizedException('Invalid refresh token');
			const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refresh_token);
			if (payload.type !== 'refresh') throw new UnauthorizedException('Invalid token type');
			const user = await this.userService.getUserById(payload.sub);
			if (!user) throw new UnauthorizedException('Invalid user');
			const access_payload: JwtPayload = {
				sub: user.id,
				username: user.name,
				type: 'access',
			};
			const new_refresh_payload: RefreshTokenPayload = {
				sub: user.id,
				username: user.name,
				type: 'refresh',
			};
			const [new_access_token, new_refresh_token] = await Promise.all([
				this.jwtService.signAsync(access_payload, {expiresIn: this.token_ttl}),
				this.jwtService.signAsync(new_refresh_payload, {expiresIn: this.refresh_ttl}),
			]);
			return {
				access_token: new_access_token,
				refresh_token: new_refresh_token,
			};
		} catch (error) {
			this.logger.debug(`Error refreshing token: ${error.message}`);
			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	public async revokeToken(refresh_token: string): Promise<boolean> {
		try {
			const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refresh_token);
			if (payload.type !== 'refresh') throw new UnauthorizedException('Invalid token type');
			this.blacklist.push(refresh_token);
			return true;
		} catch (error) {
			this.logger.debug(`Error revoking token: ${error.message}`);
			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	public async validateAccessToken(access_token: string): Promise<JwtPayload> {
		if (!access_token) throw new UnauthorizedException('No access token provided');
		try {
			const payload = await this.jwtService.verifyAsync<JwtPayload>(access_token);
			if (payload.type !== 'access') throw new UnauthorizedException('Invalid token type - access token required');
			return payload;
		} catch (error) {
			this.logger.debug(`Error validating access token: ${error.message}`);
			throw new UnauthorizedException('Invalid access token');
		}
	}

	public async getInitialization(): Promise<boolean> {
		const user_count = await this.userService.getUserCount();
		console.log('user_count', user_count);
		return user_count !== 0;
	}
}
