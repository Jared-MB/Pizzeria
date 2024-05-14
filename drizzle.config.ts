import { defineConfig } from "drizzle-kit";

import * as dotenv from "dotenv";
dotenv.config({
	path: ".env.development.local",
});

export default defineConfig({
	schema: [
		"src/db/schema/clients.ts",
		"src/db/schema/products.ts",
		"src/db/schema/orders.ts",
		"src/db/schema/employees.ts",
		"src/db/schema/categories.ts",
		"src/db/schema/orders-to-products.ts",
		"src/db/schema/sizes.ts",
		"src/db/schema/products-to-sizes.ts",
	],
	driver: "pg",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		connectionString: process.env.POSTGRES_URL!,
	},
});
