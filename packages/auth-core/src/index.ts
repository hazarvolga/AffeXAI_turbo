export {
	signAccessToken,
	signRefreshToken,
	verifyToken,
	decodeToken,
} from "./jwt.js";

export type { Role } from "./rbac.js";
export {
	ROLE_HIERARCHY,
	PERMISSIONS,
	hasRole,
	hasPermission,
} from "./rbac.js";

export {
	AuthModule,
	AUTH_OPTIONS,
	JwtStrategy,
	JwtAuthGuard,
	RolesGuard,
	Roles,
	CurrentUser,
	Public,
	IS_PUBLIC_KEY,
} from "./nestjs/index.js";
export type {
	AuthModuleOptions,
	AuthModuleAsyncOptions,
	JwtStrategyOptions,
} from "./nestjs/index.js";

export {
	AuthClient,
	AuthError,
	createAuthClient,
	useAuth,
	useSession,
} from "./nextjs/index.js";
export type {
	AuthClientConfig,
	UseAuthReturn,
	UseSessionReturn,
} from "./nextjs/index.js";

export {
	generateGoogleAuthUrl,
	exchangeGoogleCode,
	getGoogleUser,
	generateGitHubAuthUrl,
	exchangeGitHubCode,
	getGitHubUser,
} from "./oauth/index.js";
export type {
	GoogleTokenResponse,
	GoogleUserInfo,
	GitHubTokenResponse,
	GitHubUserInfo,
} from "./oauth/index.js";
