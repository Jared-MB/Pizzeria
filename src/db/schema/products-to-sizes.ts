import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { products } from "./products";
import { sizes } from "./sizes";

export const productsToSizes = pgTable(
	"product_to_size",
	{
		productId: uuid("productId")
			.references(() => products._id)
			.notNull(),
		sizeId: uuid("sizeId")
			.references(() => sizes._id)
			.notNull(),
	},
	(t) => ({
		pk: primaryKey({
			columns: [t.productId, t.sizeId],
		}),
	}),
);

export const productsToSizesRelations = relations(
	productsToSizes,
	({ one }) => ({
		product: one(products, {
			fields: [productsToSizes.productId],
			references: [products._id],
		}),
		size: one(sizes, {
			fields: [productsToSizes.sizeId],
			references: [sizes._id],
		}),
	}),
);

export const insertProductsToSizesSchema = createInsertSchema(productsToSizes);

export type ProductsToSizes = typeof productsToSizes.$inferInsert;
