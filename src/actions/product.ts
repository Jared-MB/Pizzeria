"use server";

import {
	deleteProductFromDB,
	insertProductInDB,
	selectProductFromDB,
	selectProductsFromDB,
	updateProductInDB,
} from "@/db";
import {
	type SelectProduct,
	insertProductSchema,
	type sizeEnum,
} from "@/db/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const selectProducts = async (page: number, name?: string) =>
	await selectProductsFromDB(page, name);

export const selectProduct = async (productId: string) =>
	await selectProductFromDB(productId);

export const insertProduct = async (
	_prevState: unknown,
	payload: FormData,
): Promise<{
	_id?: string[] | undefined;
	name?: string[] | undefined;
	price?: string[] | undefined;
	description?: string[] | undefined;
	quantity?: string[] | undefined;
	sizes?: string[] | undefined;
	error?: string | undefined;
}> => {
	const _id = crypto.randomUUID();

	const product = Object.fromEntries(payload.entries());
	product._id = _id;

	const sizes = Object.keys(product)
		.filter((key) => key.startsWith("size_"))
		.map((key) => key.replace("size_", ""));

	const parsedData = insertProductSchema.safeParse(product);

	if (!parsedData.success) {
		const errors = parsedData.error.flatten().fieldErrors;
		if (sizes.length === 0) {
			return { ...errors, sizes: ["Debes seleccionar al menos un tamaño"] };
		}
		return errors;
	}

	if (sizes.length === 0) {
		return { sizes: ["Debes seleccionar al menos un tamaño"] };
	}

	insertProductInDB(
		parsedData.data,
		sizes as (typeof sizeEnum.enumValues)[number][],
	).catch((error) => {
		console.log(error);
		return { error: "Error al insertar el producto" };
	});
	revalidatePath("/dashboard/products");
	redirect("/dashboard/products");
};

export const updateProduct = async (
	_prevState: unknown,
	payload: FormData,
): Promise<{
	_id?: string[] | undefined;
	name?: string[] | undefined;
	price?: string[] | undefined;
	description?: string[] | undefined;
	quantity?: string[] | undefined;
	sizes?: string[] | undefined;
	error?: string | undefined;
}> => {
	const product = Object.fromEntries(payload.entries());

	const sizes = Object.keys(product)
		.filter((key) => key.startsWith("size_"))
		.map((key) => key.replace("size_", ""));

	const parsedData = insertProductSchema.safeParse(product);

	if (!parsedData.success) {
		const errors = parsedData.error.flatten().fieldErrors;
		if (sizes.length === 0) {
			return { ...errors, sizes: ["Debes seleccionar al menos un tamaño"] };
		}
		return errors;
	}

	if (sizes.length === 0) {
		return { sizes: ["Debes seleccionar al menos un tamaño"] };
	}

	updateProductInDB(
		parsedData.data,
		sizes as (typeof sizeEnum.enumValues)[number][],
	).catch((error) => {
		console.log(error);
		return { error: "Error al insertar el producto" };
	});
	revalidatePath("/dashboard/products");
	redirect("/dashboard/products");
};

export const deleteProduct = async (payload: FormData) => {
	const productId = payload.get("_id");

	if (!productId) {
		return { error: "No se ha encontrado el producto" };
	}

	await deleteProductFromDB(productId.toString());
	revalidatePath("/dashboard/products");
	redirect("/dashboard/products");
};
