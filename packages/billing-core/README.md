# @affex/billing-core

Stripe and Lemon Squeezy billing abstraction for the affexaiFactory monorepo.

## Usage

### Stripe Provider

```typescript
import { createStripeProvider } from "@affex/billing-core";

const stripe = createStripeProvider({
	apiKey: process.env.STRIPE_SECRET_KEY!,
	webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
});

const customer = await stripe.createCustomer({
	email: "user@example.com",
	name: "Jane Doe",
});

const result = await stripe.createCheckoutSession({
	customerId: customer.providerId,
	planId: "price_1234",
	successUrl: "https://app.example.com/success",
	cancelUrl: "https://app.example.com/cancel",
});

const subscription = await stripe.getSubscription("sub_1234");
await stripe.cancelSubscription("sub_1234");
const invoices = await stripe.getInvoices(customer.providerId);

const event = stripe.handleWebhook(rawBody, signature);
```

### Lemon Squeezy Provider

```typescript
import { createLemonSqueezyProvider } from "@affex/billing-core";

const lemon = createLemonSqueezyProvider({
	apiKey: process.env.LEMONSQUEEZY_API_KEY!,
	webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
});

const customer = await lemon.createCustomer({
	email: "user@example.com",
	name: "Jane Doe",
});

const result = await lemon.createCheckout({
	variantId: "12345",
	customerId: customer.providerId,
	successUrl: "https://app.example.com/success",
	cancelUrl: "https://app.example.com/cancel",
});

const subscription = await lemon.getSubscription("123456");
await lemon.cancelSubscription("123456");
const invoices = await lemon.getInvoices(customer.email);

const event = lemon.handleWebhook(rawBody, signature);
```

### Unified Billing Client (Factory)

```typescript
import { createBillingClient } from "@affex/billing-core";

const billing = createBillingClient({
	provider: "stripe",
	stripe: {
		apiKey: process.env.STRIPE_SECRET_KEY!,
		webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
	},
});

const customer = await billing.createCustomer({
	email: "user@example.com",
	name: "Jane Doe",
});

const result = await billing.createCheckout({
	customerId: customer.id,
	planId: "price_1234",
	successUrl: "https://app.example.com/success",
	cancelUrl: "https://app.example.com/cancel",
});

const subscription = await billing.getSubscription("sub_1234");
await billing.cancelSubscription("sub_1234");
```

## Exports

- `@affex/billing-core` — All types, providers, and factory