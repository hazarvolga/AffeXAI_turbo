import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";
import type { EmailOptions, NotificationResult } from "./types.js";

export interface EmailProvider {
	send: (options: EmailOptions) => Promise<NotificationResult>;
	sendBatch: (options: EmailOptions[]) => Promise<NotificationResult[]>;
}

export function createEmailProvider(config: {
	apiKey: string;
	defaultFrom: string;
}): EmailProvider {
	const client = new Resend(config.apiKey);

	return {
		async send(options: EmailOptions): Promise<NotificationResult> {
			try {
				const payload: CreateEmailOptions = {
					from: options.from || config.defaultFrom,
					to: Array.isArray(options.to) ? options.to : [options.to],
					subject: options.subject,
					text: options.text ?? options.subject,
					...(options.html && { html: options.html }),
					...(options.replyTo && { replyTo: options.replyTo }),
					...(options.attachments && {
						attachments: options.attachments.map((a) => ({
							filename: a.filename,
							content: a.content,
						})),
					}),
				};
				const { data, error } = await client.emails.send(payload);

				if (error) {
					return { success: false, error: error.message };
				}

				return { success: true, messageId: data?.id };
			} catch (err) {
				return {
					success: false,
					error: err instanceof Error ? err.message : "Unknown error sending email",
				};
			}
		},

		async sendBatch(options: EmailOptions[]): Promise<NotificationResult[]> {
			return Promise.all(options.map((opt) => this.send(opt)));
		},
	};
}
