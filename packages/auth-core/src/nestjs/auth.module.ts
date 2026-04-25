import {
	type DynamicModule,
	type InjectionToken,
	Module,
	type OptionalFactoryDependency,
	type Provider,
} from "@nestjs/common";

export interface AuthModuleOptions {
	secret: string;
	accessTokenExpiry?: string;
	refreshTokenExpiry?: string;
}

export interface AuthModuleAsyncOptions {
	useFactory: (...args: unknown[]) => Promise<AuthModuleOptions> | AuthModuleOptions;
	inject?: (InjectionToken | OptionalFactoryDependency)[];
}

export const AUTH_OPTIONS = "AUTH_OPTIONS";

@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: NestJS dynamic modules require static methods
export class AuthModule {
	static register(options: AuthModuleOptions): DynamicModule {
		return {
			module: AuthModule,
			global: true,
			providers: [
				{
					provide: AUTH_OPTIONS,
					useValue: options,
				},
			],
			exports: [AUTH_OPTIONS],
		};
	}

	static registerAsync(options: AuthModuleAsyncOptions): DynamicModule {
		const asyncProvider: Provider = {
			provide: AUTH_OPTIONS,
			useFactory: options.useFactory,
			inject: options.inject ?? [],
		};

		return {
			module: AuthModule,
			global: true,
			providers: [asyncProvider],
			exports: [AUTH_OPTIONS],
		};
	}
}
