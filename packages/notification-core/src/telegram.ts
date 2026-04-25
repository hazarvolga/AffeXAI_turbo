import { Telegraf } from "telegraf";
import type { NotificationResult, TelegramOptions } from "./types.js";

export interface TelegramProvider {
	send: (options: TelegramOptions) => Promise<NotificationResult>;
}

export function createTelegramProvider(config: { token: string }): TelegramProvider {
	const bot = new Telegraf(config.token);

	return {
		async send(options: TelegramOptions): Promise<NotificationResult> {
			try {
				const result = await bot.telegram.sendMessage(options.chatId, options.text, {
					parse_mode: options.parseMode,
					disable_notification: options.disableNotification,
				});

				return {
					success: true,
					messageId: String(result.message_id),
				};
			} catch (err) {
				return {
					success: false,
					error: err instanceof Error ? err.message : "Unknown error sending Telegram message",
				};
			}
		},
	};
}
