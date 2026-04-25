import Stripe from "stripe";
import type {
	BillingCustomer,
	BillingInvoice,
	BillingPaymentResult,
	BillingSubscription,
	BillingSubscriptionStatus,
	BillingWebhookEvent,
} from "./types.js";

export interface StripeConfig {
	apiKey: string;
	webhookSecret: string;
}

interface CreateCustomerData {
	email: string;
	name: string;
	metadata?: Record<string, string>;
}

interface CheckoutSessionParams {
	customerId: string;
	planId: string;
	successUrl: string;
	cancelUrl: string;
}

function mapSubscriptionStatus(status: Stripe.Subscription.Status): BillingSubscriptionStatus {
	const statusMap: Record<string, BillingSubscriptionStatus> = {
		active: "active",
		past_due: "past_due",
		canceled: "canceled",
		trialing: "trialing",
	};
	return statusMap[status] ?? "canceled";
}

export function createStripeProvider(config: StripeConfig) {
	const client = new Stripe(config.apiKey);

	return {
		async createCustomer(data: CreateCustomerData): Promise<BillingCustomer> {
			const customer = await client.customers.create({
				email: data.email,
				name: data.name,
				metadata: data.metadata,
			});

			return {
				id: customer.id,
				email: customer.email ?? data.email,
				name: customer.name ?? data.name,
				provider: "stripe",
				providerId: customer.id,
				createdAt: new Date(customer.created * 1000),
			};
		},

		async createCheckoutSession(params: CheckoutSessionParams): Promise<BillingPaymentResult> {
			try {
				const session = await client.checkout.sessions.create({
					customer: params.customerId,
					mode: "subscription",
					line_items: [
						{
							price: params.planId,
							quantity: 1,
						},
					],
					success_url: params.successUrl,
					cancel_url: params.cancelUrl,
				});

				return {
					success: true,
					sessionId: session.id,
				};
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Unknown error creating checkout session";
				return {
					success: false,
					error: message,
				};
			}
		},

		async getSubscription(subscriptionId: string): Promise<BillingSubscription> {
			const subscription = await client.subscriptions.retrieve(subscriptionId);

			return {
				id: subscription.id,
				customerId:
					typeof subscription.customer === "string"
						? subscription.customer
						: subscription.customer.id,
				status: mapSubscriptionStatus(subscription.status),
				planId:
					typeof subscription.items.data[0]?.price === "object"
						? subscription.items.data[0].price.id
						: (subscription.items.data[0]?.price as unknown as string),
				currentPeriodEnd: new Date(subscription.current_period_end * 1000),
				cancelAtPeriodEnd: subscription.cancel_at_period_end,
			};
		},

		async cancelSubscription(subscriptionId: string): Promise<void> {
			await client.subscriptions.update(subscriptionId, {
				cancel_at_period_end: true,
			});
		},

		async getInvoices(customerId: string): Promise<BillingInvoice[]> {
			const invoices = await client.invoices.list({
				customer: customerId,
			});

			return invoices.data.map((invoice) => ({
				id: invoice.id,
				customerId: invoice.customer as string,
				amount: invoice.total,
				currency: invoice.currency,
				status: (invoice.status ?? "draft") as "draft" | "open" | "paid" | "void" | "uncollectible",
				dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
				paidAt: invoice.status_transitions.paid_at
					? new Date(invoice.status_transitions.paid_at * 1000)
					: null,
			}));
		},

		handleWebhook(rawBody: string | Buffer, signature: string): BillingWebhookEvent {
			const event = client.webhooks.constructEvent(rawBody, signature, config.webhookSecret);

			return {
				type: event.type,
				provider: "stripe",
				data: event.data.object as unknown as Record<string, unknown>,
				timestamp: new Date(event.created * 1000),
			};
		},
	};
}
