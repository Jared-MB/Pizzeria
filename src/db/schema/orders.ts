import { relations } from "drizzle-orm";
import {
	boolean,
	pgEnum,
	pgTable,
	primaryKey,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { clients } from "./clients";
import { ordersToProducts } from "./orders-to-products";
import { products } from "./products";

export const typeEnum = pgEnum("type", ["DELIVERY", "LOCAL"]);
export const paymentMethodEnum = pgEnum("paymentMethod", ["CASH", "CARD"]);

export const orders = pgTable("order", {
	_id: uuid("_id").primaryKey(),
	clientId: uuid("clientId")
		.references(() => clients._id)
		.notNull(),
	type: typeEnum("type").notNull().default("LOCAL"),
	paymentMethod: paymentMethodEnum("paymentMethod").notNull().default("CASH"),
	createdAt: timestamp("created_at").notNull().default(new Date()),
	delivered: boolean("delivered").notNull().default(false),
});

export const ordersRelations = relations(orders, ({ many }) => ({
	ordersToProducts: many(ordersToProducts),
}));

export type InsertOrder = typeof orders.$inferInsert;
export type Order = typeof orders.$inferSelect;

export const insertOrderSchema = createInsertSchema(orders, {
	clientId: z.string().uuid("No se ha seleccionado ningún cliente"),
});
