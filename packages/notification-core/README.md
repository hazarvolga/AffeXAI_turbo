# @affex/notification-core

Email (Resend), Slack, Telegram, and in-app notification abstraction for affexaiFactory.

> **Layer:** OPTIONAL_LATER — This package is not yet wired into production apps.

## Installation

```bash
pnpm add @affex/notification-core
```

## Usage

### Create a notification client

```typescript
import { createNotificationClient } from "@affex/notification-core";

const client = createNotificationClient({
	resend: {
		apiKey: process.env.RESEND_API_KEY,
		defaultFrom: "noreply@example.com",
	},
	slack: {
		token: process.env.SLACK_TOKEN,
		defaultChannel: "#alerts",
	},
	telegram: {
		token: process.env.TELEGRAM_BOT_TOKEN,
	},
});
```

### Send to multiple channels

```typescript
const results = await client.send({
	to: "user@example.com",
	subject: "Welcome",
	body: "Thanks for signing up!",
	channel: ["email", "in-app"],
});
```

### Send to a single channel

```typescript
const result = await client.sendToChannel("slack", {
	to: "#general",
	subject: "Deploy",
	body: "Production deploy completed.",
	channel: "slack",
});
```

### Standalone providers

```typescript
import { createEmailProvider } from "@affex/notification-core";

const email = createEmailProvider({
	apiKey: process.env.RESEND_API_KEY,
	defaultFrom: "noreply@example.com",
});

await email.send({
	to: "user@example.com",
	from: "noreply@example.com",
	subject: "Test",
	text: "Hello!",
});
```

### In-app notifications

```typescript
import { createInAppProvider } from "@affex/notification-core";

const inApp = createInAppProvider();

inApp.send({
	id: crypto.randomUUID(),
	userId: "user-123",
	title: "New message",
	body: "You have a new message",
	type: "info",
	read: false,
	createdAt: new Date(),
});

const notifications = inApp.getNotifications("user-123");
inApp.markAllAsRead("user-123");
```

## No cross-core dependencies

This package does NOT depend on any other `@affex/*-core` package, per project boundary rules.