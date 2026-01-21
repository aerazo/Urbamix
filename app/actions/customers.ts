"use server";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export async function getCustomers() {
    const data = await db.select().from(customers).orderBy(desc(customers.id));
    return data;
}

export async function createCustomer(data: Omit<NewCustomer, "id">) {
    await db.insert(customers).values(data);
    revalidatePath("/customers");
}

export async function updateCustomer(id: number, data: Partial<NewCustomer>) {
    await db.update(customers).set(data).where(eq(customers.id, id));
    revalidatePath("/customers");
}

export async function deleteCustomer(id: number) {
    await db.delete(customers).where(eq(customers.id, id));
    revalidatePath("/customers");
}

export async function getCustomerByRut(rut: string) {
    const result = await db.select().from(customers).where(eq(customers.rut, rut)).limit(1);
    return result[0] || null;
}
