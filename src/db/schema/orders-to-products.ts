import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { orders } from "./orders";
import { products } from "./products";

export const ordersToProducts = pgTable(
	"order_to_product",
	{
		orderId: uuid("orderId")
			.references(() => orders._id)
			.notNull(),
		productId: uuid("productId")
			.references(() => products._id)
			.notNull(),
		quantity: integer("quantity").notNull().default(1),
	},
	(t) => ({
		pk: primaryKey({
			columns: [t.orderId, t.productId],
		}),
	}),
);

export const ordersToProductsRelations = relations(
	ordersToProducts,
	({ one }) => ({
		order: one(orders, {
			fields: [ordersToProducts.orderId],
			references: [orders._id],
		}),
		product: one(products, {
			fields: [ordersToProducts.productId],
			references: [products._id],
		}),
	}),
);

export type InsertOrdersToProducts = typeof ordersToProducts.$inferInsert;
export const insertOrdersToProductsSchema =
	createInsertSchema(ordersToProducts);
