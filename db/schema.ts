
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
    id: serial("id").primaryKey(),
    rut: varchar("rut", { length: 20 }).notNull(),
    name: text("name").notNull(),
});
