# @affex/auth-core

JWT auth, OAuth, and RBAC primitives for NestJS and Next.js in the affexaiFactory monorepo.

## Usage

### JWT Utilities

```typescript
import { signAccessToken, signRefreshToken, verifyToken, decodeToken } from "@affex/auth-core";

const payload = { sub: "user-id", email: "user@example.com", role: "admin" };
const accessToken = signAccessToken(payload, "secret");
const refreshToken = signRefreshToken(payload, "secret");

const decoded = verifyToken(accessToken, "secret");
const unsafe = decodeToken(accessToken);
```

### RBAC

```typescript
import { hasRole, hasPermission, ROLE_HIERARCHY, PERMISSIONS } from "@affex/auth-core";

hasRole("admin", "user"); // true
hasRole("viewer", "user"); // false

hasPermission("admin", "settings:delete"); // true
hasPermission("viewer", "projects:write"); // false
```

### NestJS Integration

```typescript
import { AuthModule, JwtAuthGuard, RolesGuard, Roles, CurrentUser, Public } from "@affex/auth-core/nestjs";

// Synchronous registration
@Module({
  imports: [AuthModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [AppController],
})
class AppModule {}

// Async registration (e.g., from ConfigModule)
@Module({
  imports: [
    AuthModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_SECRET"),
      }),
      inject: [ConfigService],
    }),
  ],
})
class AppModule {}

// Controller with guards and decorators
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
class UsersController {
  @Get("profile")
  getProfile(@CurrentUser() user: TokenPayload) {
    return user;
  }

  @Get("admin")
  @Roles("admin")
  adminOnly() {
    return "admin access";
  }

  @Get("public")
  @Public()
  publicEndpoint() {
    return "no auth required";
  }
}
```

### Next.js Integration

```typescript
import { createAuthClient, useAuth } from "@affex/auth-core/nextjs";

// Direct client usage
const client = createAuthClient({ baseUrl: "https://api.example.com" });
await client.signIn("user@example.com", "password");
await client.signUp("User", "user@example.com", "password");
client.signOut();
const session = client.getSession();

// React hooks
function LoginPage() {
  const { user, isLoading, signIn, signOut } = useAuth({
    baseUrl: "https://api.example.com",
  });

  if (isLoading) return <div>Loading...</div>;

  return user ? (
    <button onClick={signOut}>Sign Out</button>
  ) : (
    <button onClick={() => signIn("user@example.com", "password")}>Sign In</button>
  );
}
```

### OAuth (Google & GitHub)

```typescript
import {
  generateGoogleAuthUrl,
  exchangeGoogleCode,
  getGoogleUser,
  generateGitHubAuthUrl,
  exchangeGitHubCode,
  getGitHubUser,
} from "@affex/auth-core";

// Google OAuth
const authUrl = generateGoogleAuthUrl(clientId, redirectUri);
const tokens = await exchangeGoogleCode(code, clientId, clientSecret, redirectUri);
const googleUser = await getGoogleUser(tokens.access_token);

// GitHub OAuth
const authUrl = generateGitHubAuthUrl(clientId, redirectUri);
const tokens = await exchangeGitHubCode(code, clientId, clientSecret, redirectUri);
const githubUser = await getGitHubUser(tokens.access_token);
```

## Exports

- `@affex/auth-core` — All exports
- `@affex/auth-core/jwt` — JWT utilities
- `@affex/auth-core/rbac` — RBAC primitives
- `@affex/auth-core/nestjs` — NestJS auth module, strategy, guards, decorators
- `@affex/auth-core/nextjs` — Next.js auth client and React hooks
- `@affex/auth-core/oauth/google` — Google OAuth helpers
- `@affex/auth-core/oauth/github` — GitHub OAuth helpers