import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import {
	integer,
	pgTable,
	real,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { ordersToProducts } from "./orders-to-products";
import { productsToSizes } from "./products-to-sizes";
import type { sizeEnum } from "./sizes";

export const products = pgTable("product", {
	_id: uuid("_id").primaryKey(),
	name: varchar("name", {
		length: 256,
	}).notNull(),
	price: real("price").notNull(),
	description: text("description"),
	quantity: integer("quantity").notNull(),
});

type Product = typeof products.$inferSelect;
export interface SelectProduct extends Product {
	sizes: (typeof sizeEnum.enumValues)[number][];
}

export const insertProductSchema = createInsertSchema(products, {
	name: z
		.string()
		.min(3, "El nombre debe tener entre 3 y 255 caracteres")
		.max(255, "El nombre debe tener entre 3 y 255 caracteres"),
	price: z.preprocess(
		(val) => Number(val),
		z.number().int().min(1, "El precio debe ser mayor a 0"),
	),
	quantity: z.preprocess(
		(val) => Number(val),
		z.number().int().min(1, "La cantidad debe ser mayor a 0"),
	),
});

export type InsertProductSchema = z.infer<typeof insertProductSchema>;

export const productsSizesRelations = relations(products, ({ many }) => ({
	productsToSizes: many(productsToSizes),
}));

export const productsRelations = relations(products, ({ many }) => ({
	ordersToProducts: many(ordersToProducts),
}));
