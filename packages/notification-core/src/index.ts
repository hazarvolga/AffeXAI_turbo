export type {
	EmailOptions,
	InAppNotification,
	NotificationChannel,
	NotificationConfig,
	NotificationMessage,
	NotificationResult,
	SlackOptions,
	TelegramOptions,
} from "./types.js";

export { createEmailProvider, type EmailProvider } from "./email.js";
export { createInAppProvider, type InAppProvider } from "./in-app.js";
export {
	createNotificationClient,
	type NotificationClient,
} from "./factory.js";
export { createSlackProvider, type SlackProvider } from "./slack.js";
export { createTelegramProvider, type TelegramProvider } from "./telegram.js";
