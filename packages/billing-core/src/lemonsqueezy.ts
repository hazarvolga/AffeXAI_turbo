import {
	lemonSqueezySetup,
	cancelSubscription as lsCancelSubscription,
	createCheckout as lsCreateCheckout,
	createCustomer as lsCreateCustomer,
	getSubscription as lsGetSubscription,
	listSubscriptions as lsListSubscriptions,
} from "@lemonsqueezy/lemonsqueezy.js";
import type {
	BillingCustomer,
	BillingInvoice,
	BillingPaymentResult,
	BillingSubscription,
	BillingSubscriptionStatus,
	BillingWebhookEvent,
} from "./types.js";

export interface LemonSqueezyConfig {
	apiKey: string;
	webhookSecret: string;
	storeId: string;
}

interface CreateCustomerData {
	email: string;
	name: string;
}

interface CheckoutParams {
	variantId: string;
	customerId?: string;
	successUrl: string;
	cancelUrl: string;
}

function mapSubscriptionStatus(status: string): BillingSubscriptionStatus {
	const statusMap: Record<string, BillingSubscriptionStatus> = {
		active: "active",
		past_due: "past_due",
		cancelled: "canceled",
		on_trial: "trialing",
		trialling: "trialing",
		paused: "past_due",
		expired: "canceled",
		unpaid: "past_due",
	};
	return statusMap[status] ?? "canceled";
}

export function createLemonSqueezyProvider(config: LemonSqueezyConfig) {
	lemonSqueezySetup({ apiKey: config.apiKey });

	return {
		async createCustomer(data: CreateCustomerData): Promise<BillingCustomer> {
			const response = await lsCreateCustomer(config.storeId, {
				name: data.name,
				email: data.email,
			});

			const customerData = response.data?.data;

			return {
				id: String(customerData?.id ?? crypto.randomUUID()),
				email: data.email,
				name: data.name,
				provider: "lemonsqueezy",
				providerId: String(customerData?.id ?? ""),
				createdAt: customerData?.attributes?.created_at
					? new Date(customerData.attributes.created_at)
					: new Date(),
			};
		},

		async createCheckout(params: CheckoutParams): Promise<BillingPaymentResult> {
			try {
				const checkout = await lsCreateCheckout(config.storeId, params.variantId, {
					productOptions: {
						redirectUrl: params.successUrl,
					},
					checkoutData: {
						email: params.customerId ? undefined : undefined,
						custom: params.customerId ? { customer_id: params.customerId } : undefined,
					},
				});

				const checkoutUrl = checkout.data?.data?.attributes?.url;

				return {
					success: true,
					sessionId: checkoutUrl,
				};
			} catch (error) {
				const message = error instanceof Error ? error.message : "Unknown error creating checkout";
				return {
					success: false,
					error: message,
				};
			}
		},

		async getSubscription(subscriptionId: string): Promise<BillingSubscription> {
			const response = await lsGetSubscription(subscriptionId);
			const sub = response.data?.data;
			const attrs = sub?.attributes;

			return {
				id: String(sub?.id ?? subscriptionId),
				customerId: String(attrs?.customer_id ?? ""),
				status: mapSubscriptionStatus(String(attrs?.status ?? "cancelled")),
				planId: String(attrs?.variant_id ?? ""),
				currentPeriodEnd: attrs?.renews_at ? new Date(attrs.renews_at) : new Date(),
				cancelAtPeriodEnd: Boolean(attrs?.cancelled),
			};
		},

		async cancelSubscription(subscriptionId: string): Promise<void> {
			await lsCancelSubscription(subscriptionId);
		},

		async getInvoices(customerId: string): Promise<BillingInvoice[]> {
			const response = await lsListSubscriptions({
				filter: { userEmail: customerId },
			});

			const subscriptions = response.data?.data ?? [];

			return subscriptions.flatMap((sub) => {
				const attrs = sub.attributes;
				if (!attrs.urls) return [];

				return [
					{
						id: String(sub.id),
						customerId: String(attrs.customer_id ?? ""),
						amount: 0,
						currency: "usd",
						status: "paid" as const,
						dueDate: null,
						paidAt: null,
					},
				];
			});
		},

		handleWebhook(rawBody: string | Buffer, _signature: string): BillingWebhookEvent {
			const body = typeof rawBody === "string" ? rawBody : rawBody.toString("utf8");
			const parsed = JSON.parse(body);

			return {
				type: parsed.meta?.event_name ?? "unknown",
				provider: "lemonsqueezy",
				data: parsed.data ?? {},
				timestamp: parsed.meta?.event_timestamp
					? new Date(parsed.meta.event_timestamp)
					: new Date(),
			};
		},
	};
}
