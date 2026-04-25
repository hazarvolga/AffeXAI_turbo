export type BillingProvider = "stripe" | "lemonsqueezy";

export interface BillingCustomer {
	id: string;
	email: string;
	name: string;
	provider: BillingProvider;
	providerId: string;
	createdAt: Date;
}

export type BillingSubscriptionStatus = "active" | "past_due" | "canceled" | "trialing";

export interface BillingSubscription {
	id: string;
	customerId: string;
	status: BillingSubscriptionStatus;
	planId: string;
	currentPeriodEnd: Date;
	cancelAtPeriodEnd: boolean;
}

export type BillingInterval = "monthly" | "yearly";

export interface BillingPlan {
	id: string;
	name: string;
	price: number;
	currency: string;
	interval: BillingInterval;
	features: string[];
}

export type BillingInvoiceStatus = "draft" | "open" | "paid" | "void" | "uncollectible";

export interface BillingInvoice {
	id: string;
	customerId: string;
	amount: number;
	currency: string;
	status: BillingInvoiceStatus;
	dueDate: Date | null;
	paidAt: Date | null;
}

export interface BillingPaymentResult {
	success: boolean;
	sessionId?: string;
	error?: string;
}

export interface BillingWebhookEvent {
	type: string;
	provider: BillingProvider;
	data: Record<string, unknown>;
	timestamp: Date;
}
