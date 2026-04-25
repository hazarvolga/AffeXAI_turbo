import { type EmailProvider, createEmailProvider } from "./email.js";
import { type InAppProvider, createInAppProvider } from "./in-app.js";
import { type SlackProvider, createSlackProvider } from "./slack.js";
import { type TelegramProvider, createTelegramProvider } from "./telegram.js";
import type {
	InAppNotification,
	NotificationChannel,
	NotificationConfig,
	NotificationMessage,
	NotificationResult,
} from "./types.js";

export interface NotificationClient {
	send: (message: NotificationMessage) => Promise<Record<string, NotificationResult>>;
	sendToChannel: (
		channel: NotificationChannel,
		message: NotificationMessage,
	) => Promise<NotificationResult>;
}

let emailProvider: EmailProvider | null = null;
let slackProvider: SlackProvider | null = null;
let telegramProvider: TelegramProvider | null = null;
let inAppProvider: InAppProvider | null = null;

export function createNotificationClient(config: NotificationConfig): NotificationClient {
	if (config.resend) {
		emailProvider = createEmailProvider(config.resend);
	}
	if (config.slack) {
		slackProvider = createSlackProvider(config.slack);
	}
	if (config.telegram) {
		telegramProvider = createTelegramProvider(config.telegram);
	}
	inAppProvider = createInAppProvider();

	return {
		async send(message: NotificationMessage): Promise<Record<string, NotificationResult>> {
			const channels = Array.isArray(message.channel) ? message.channel : [message.channel];
			const results: Record<string, NotificationResult> = {};

			await Promise.all(
				channels.map(async (channel) => {
					results[channel] = await this.sendToChannel(channel, message);
				}),
			);

			return results;
		},

		async sendToChannel(
			channel: NotificationChannel,
			message: NotificationMessage,
		): Promise<NotificationResult> {
			switch (channel) {
				case "email": {
					if (!emailProvider) {
						return { success: false, error: "Email provider not configured" };
					}
					return emailProvider.send({
						to: message.to,
						from: config.resend?.defaultFrom,
						subject: message.subject,
						text: message.body,
						html: message.html,
					});
				}
				case "slack": {
					if (!slackProvider) {
						return { success: false, error: "Slack provider not configured" };
					}
					return slackProvider.send({
						channel: config.slack?.defaultChannel,
						text: message.body,
					});
				}
				case "telegram": {
					if (!telegramProvider) {
						return { success: false, error: "Telegram provider not configured" };
					}
					return telegramProvider.send({
						chatId: Array.isArray(message.to) ? message.to[0] : message.to,
						text: message.body,
					});
				}
				case "in-app": {
					if (!inAppProvider) {
						return { success: false, error: "In-app provider not configured" };
					}
					const userId = Array.isArray(message.to) ? message.to[0] : message.to;
					const notification: InAppNotification = {
						id: crypto.randomUUID(),
						userId,
						title: message.subject,
						body: message.body,
						type: "info",
						read: false,
						createdAt: new Date(),
					};
					return inAppProvider.send(notification);
				}
				default:
					return { success: false, error: `Unknown channel: ${channel}` };
			}
		},
	};
}
