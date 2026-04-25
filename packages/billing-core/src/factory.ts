import { type LemonSqueezyConfig, createLemonSqueezyProvider } from "./lemonsqueezy.js";
import { type StripeConfig, createStripeProvider } from "./stripe.js";
import type { BillingProvider } from "./types.js";

export interface BillingClientConfig {
	provider: BillingProvider;
	stripe?: StripeConfig;
	lemonsqueezy?: LemonSqueezyConfig;
}

export interface BillingClient {
	provider: BillingProvider;
	createCustomer: (data: {
		email: string;
		name: string;
		metadata?: Record<string, string>;
	}) => Promise<import("./types.js").BillingCustomer>;
	createCheckout: (params: {
		customerId: string;
		planId: string;
		successUrl: string;
		cancelUrl: string;
		variantId?: string;
	}) => Promise<import("./types.js").BillingPaymentResult>;
	getSubscription: (subscriptionId: string) => Promise<import("./types.js").BillingSubscription>;
	cancelSubscription: (subscriptionId: string) => Promise<void>;
	getInvoices: (customerId: string) => Promise<import("./types.js").BillingInvoice[]>;
	handleWebhook: (
		rawBody: string | Buffer,
		signature: string,
	) => import("./types.js").BillingWebhookEvent;
}

export function createBillingClient(config: BillingClientConfig): BillingClient {
	if (config.provider === "stripe") {
		if (!config.stripe) {
			throw new Error("Stripe configuration is required when provider is 'stripe'");
		}

		const provider = createStripeProvider(config.stripe);

		return {
			provider: "stripe",
			createCustomer: (data) => provider.createCustomer(data),
			createCheckout: (params) =>
				provider.createCheckoutSession({
					customerId: params.customerId,
					planId: params.planId,
					successUrl: params.successUrl,
					cancelUrl: params.cancelUrl,
				}),
			getSubscription: (id) => provider.getSubscription(id),
			cancelSubscription: (id) => provider.cancelSubscription(id),
			getInvoices: (id) => provider.getInvoices(id),
			handleWebhook: (rawBody, signature) => provider.handleWebhook(rawBody, signature),
		};
	}

	if (config.provider === "lemonsqueezy") {
		if (!config.lemonsqueezy) {
			throw new Error("Lemon Squeezy configuration is required when provider is 'lemonsqueezy'");
		}

		const provider = createLemonSqueezyProvider(config.lemonsqueezy);

		return {
			provider: "lemonsqueezy",
			createCustomer: (data) => provider.createCustomer(data),
			createCheckout: (params) =>
				provider.createCheckout({
					variantId: params.variantId ?? params.planId,
					customerId: params.customerId,
					successUrl: params.successUrl,
					cancelUrl: params.cancelUrl,
				}),
			getSubscription: (id) => provider.getSubscription(id),
			cancelSubscription: (id) => provider.cancelSubscription(id),
			getInvoices: (id) => provider.getInvoices(id),
			handleWebhook: (rawBody, signature) => provider.handleWebhook(rawBody, signature),
		};
	}

	throw new Error(`Unknown billing provider: ${config.provider}`);
}
