import type { InAppNotification, NotificationResult } from "./types.js";

export interface InAppProvider {
	send: (notification: InAppNotification) => NotificationResult;
	getNotifications: (userId: string) => InAppNotification[];
	markAsRead: (userId: string, notificationId: string) => void;
	markAllAsRead: (userId: string) => void;
}

export function createInAppProvider(): InAppProvider {
	const store = new Map<string, InAppNotification[]>();

	return {
		send(notification: InAppNotification): NotificationResult {
			const userId = notification.userId;
			const userNotifications = store.get(userId) ?? [];
			userNotifications.push(notification);
			store.set(userId, userNotifications);
			return { success: true, messageId: notification.id };
		},

		getNotifications(userId: string): InAppNotification[] {
			return store.get(userId) ?? [];
		},

		markAsRead(userId: string, notificationId: string): void {
			const userNotifications = store.get(userId);
			if (!userNotifications) return;
			const notification = userNotifications.find((n) => n.id === notificationId);
			if (notification) {
				notification.read = true;
			}
		},

		markAllAsRead(userId: string): void {
			const userNotifications = store.get(userId);
			if (!userNotifications) return;
			for (const notification of userNotifications) {
				notification.read = true;
			}
		},
	};
}
