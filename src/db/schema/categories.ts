import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable("category", {
    _id: uuid("_id").primaryKey(),
    name: varchar("name", {
        length: 256
    }).notNull()
})