import { WebClient } from "@slack/web-api";
import type { NotificationResult, SlackOptions } from "./types.js";

export interface SlackProvider {
	send: (options: SlackOptions) => Promise<NotificationResult>;
}

export function createSlackProvider(config: {
	token: string;
	defaultChannel: string;
}): SlackProvider {
	const client = new WebClient(config.token);

	return {
		async send(options: SlackOptions): Promise<NotificationResult> {
			try {
				const result = await client.chat.postMessage({
					channel: options.channel || config.defaultChannel,
					text: options.text,
					blocks: options.blocks as Array<{ type: string }> | undefined,
					attachments: options.attachments as Array<{ text: string; fallback: string }> | undefined,
				});

				if (!result.ok) {
					return { success: false, error: "Failed to post Slack message" };
				}

				return {
					success: true,
					messageId: result.ts ?? undefined,
				};
			} catch (err) {
				return {
					success: false,
					error: err instanceof Error ? err.message : "Unknown error sending Slack message",
				};
			}
		},
	};
}
