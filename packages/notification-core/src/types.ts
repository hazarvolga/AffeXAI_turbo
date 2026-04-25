export type NotificationChannel = "email" | "slack" | "telegram" | "in-app";

export interface NotificationMessage {
	to: string | string[];
	subject: string;
	body: string;
	html?: string;
	channel: NotificationChannel | NotificationChannel[];
}

export interface NotificationResult {
	success: boolean;
	messageId?: string;
	error?: string;
}

export interface EmailOptions {
	to: string | string[];
	from: string;
	subject: string;
	text?: string;
	html?: string;
	replyTo?: string;
	attachments?: Array<{
		filename: string;
		content: string | Buffer;
	}>;
}

export interface SlackOptions {
	channel: string;
	text: string;
	blocks?: unknown[];
	attachments?: unknown[];
}

export interface TelegramOptions {
	chatId: string | number;
	text: string;
	parseMode?: "Markdown" | "MarkdownV2" | "HTML";
	disableNotification?: boolean;
}

export interface InAppNotification {
	id: string;
	userId: string;
	title: string;
	body: string;
	type: "info" | "warning" | "error" | "success";
	read: boolean;
	createdAt: Date;
}

export interface NotificationConfig {
	resend?: {
		apiKey: string;
		defaultFrom: string;
	};
	slack?: {
		token: string;
		defaultChannel: string;
	};
	telegram?: {
		token: string;
	};
}
