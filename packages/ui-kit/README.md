# @affex/ui-kit

Reusable React component library built on shadcn/ui patterns with Tailwind CSS.

## Installation

```bash
pnpm add @affex/ui-kit
```

## Usage

```tsx
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from "@affex/ui-kit";
import { Modal } from "@affex/ui-kit/modal";
import { cn } from "@affex/ui-kit/utils";
```

### Button

```tsx
import { Button } from "@affex/ui-kit";

export function Example() {
	return (
		<div>
			<Button>Default</Button>
			<Button variant="destructive">Delete</Button>
			<Button variant="outline" size="sm">Cancel</Button>
			<Button variant="ghost" size="icon">✕</Button>
		</div>
	);
}
```

### Input

```tsx
import { Input } from "@affex/ui-kit";

export function Example() {
	return <Input placeholder="Enter your name" />;
}
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@affex/ui-kit";

export function Example() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Title</CardTitle>
			</CardHeader>
			<CardContent>Content here</CardContent>
		</Card>
	);
}
```

### DataTable

```tsx
import { DataTable, type Column } from "@affex/ui-kit";

interface User { id: string; name: string; email: string; }

const columns: Column<User>[] = [
	{ key: "name", header: "Name", sortable: true },
	{ key: "email", header: "Email", sortable: true },
];

export function Example() {
	return <DataTable columns={columns} data={users} onRowClick={(row) => console.log(row)} />;
}
```

### FormField

```tsx
import { FormField, Input } from "@affex/ui-kit";

export function Example() {
	return (
		<FormField label="Email" description="We'll never share your email." error="Required">
			<Input type="email" />
		</FormField>
	);
}
```

### Modal

```tsx
import { Modal } from "@affex/ui-kit";

export function Example() {
	return (
		<Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm" size="sm">
			<p>Are you sure?</p>
		</Modal>
	);
}
```