import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const clients = pgTable("client", {
	_id: uuid("_id").primaryKey(),
	name: varchar("name", {
		length: 256,
	}).notNull(),
	address: varchar("address", {
		length: 256,
	}).default("Sin dirección"),
	phone: varchar("phone", {
		length: 13,
	}).default("Sin teléfono"),
});

export const insertClientSchema = createInsertSchema(clients);
export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;
