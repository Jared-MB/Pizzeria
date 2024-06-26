"use server";

import {
	insertClientInDB,
	selectClientFromDB,
	selectClientsFromDB,
	updateClientInDB,
} from "@/db";
import { insertClientSchema } from "@/db/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const insertClient = async (_prevState: unknown, payload: FormData) => {
	const _id = crypto.randomUUID();

	const client = Object.fromEntries(payload.entries());
	client._id = _id;

	const parsedData = insertClientSchema.safeParse(client);

	if (!parsedData.success) {
		return parsedData.error.flatten().fieldErrors;
	}

	insertClientInDB(parsedData.data).catch((error) => {
		console.error("Error inserting client", error);
		return { error: "Error inserting client" };
	});

	revalidatePath("/dashboard/clients");
	redirect("/dashboard/clients");
};

export const updateClient = async (_prevState: unknown, payload: FormData) => {
	const client = Object.fromEntries(payload.entries());

	const parsedData = insertClientSchema.safeParse(client);

	if (!parsedData.success) {
		return parsedData.error.flatten().fieldErrors;
	}

	updateClientInDB(parsedData.data).catch((error) => {
		console.error("Error updating client", error);
		return { error: "Error updating client" };
	});

	revalidatePath("/dashboard/clients");
	redirect("/dashboard/clients");
};

export const selectClients = async (page: number, name?: string) =>
	await selectClientsFromDB(page, name);

export const selectClient = async (_id: string) =>
	(await selectClientFromDB(_id))[0];
