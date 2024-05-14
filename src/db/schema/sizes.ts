import { relations } from "drizzle-orm";
import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { productsToSizes } from "./products-to-sizes";

import { z } from "zod";

export const sizeEnum = pgEnum("sizeEnum", ["XS", "S", "M", "L", "XL", "XXL"]);

export const sizes = pgTable("size", {
	_id: uuid("_id").primaryKey(),
	name: sizeEnum("name").notNull(),
});

export const insertSizeSchema = createInsertSchema(sizes, {
	_id: z.string().optional(),
});
export type InsertSizeSchema = typeof sizes.$inferInsert;

export const sizesRelations = relations(sizes, ({ many }) => ({
	productsToSizes: many(productsToSizes),
}));
