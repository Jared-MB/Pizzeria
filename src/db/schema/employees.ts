import { pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["ADMIN", "USER"]);

export const employees = pgTable("employee", {
	_id: uuid("_id").primaryKey(),
	name: varchar("name", {
		length: 256,
	}).notNull(),
	username: varchar("username", {
		length: 32,
	}).notNull(),
	password: varchar("password").notNull(),
	role: roleEnum("role").notNull().default("USER"),
	permissions: text("permissions").notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;

export const insertEmployeeSchema = createInsertSchema(employees, {
	password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});
