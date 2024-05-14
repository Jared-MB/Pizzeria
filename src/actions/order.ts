"use server";

import {
	changeOrderStatusInDB,
	insertOrderInDB,
	insertOrderToProductsInDB,
	selectOrderFromDB,
	selectOrdersFromDB,
} from "@/db";
import {
	type InsertOrder,
	insertOrderSchema,
	insertOrdersToProductsSchema,
} from "@/db/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const selectOrders = async (page: number, name?: string) =>
	await selectOrdersFromDB(page, name);
export const selectOrder = async (_id: string) => await selectOrderFromDB(_id);

export const insertOrder = async (_prevState: unknown, payload: FormData) => {
	const data = Object.fromEntries(payload.entries());
	const order = Object.entries(data)
		.filter(([key]) => !key.startsWith("product-") && !key.startsWith("$"))
		.map(([key, value]) => ({
			[key]: value,
		}))
		.reduce((accumulator, currentObject) => {
			return Object.assign(accumulator, currentObject);
		}, {});
	const products = Object.entries(data)
		.filter(([key]) => key.startsWith("product-"))
		.map(([key, value]) => ({
			[key.replace("product-", "")]: Number(
				value.toString().replace("quantity-", ""),
			),
		}))
		.reduce((accumulator, currentObject) => {
			return Object.assign(accumulator, currentObject);
		}, {});

	const _id = crypto.randomUUID();

	const parsedOrder = insertOrderSchema.safeParse({
		_id,
		...order,
	});

	if (!parsedOrder.success) {
		console.error(parsedOrder.error.flatten().fieldErrors);
		return parsedOrder.error.flatten().fieldErrors;
	}

	const orderToProducts = Object.entries(products).map(
		([product, quantity]) => ({
			orderId: _id,
			productId: product,
			quantity: quantity,
		}),
	);

	for (const orderToProduct of orderToProducts) {
		const parsedOrderToProduct =
			insertOrdersToProductsSchema.safeParse(orderToProduct);

		if (!parsedOrderToProduct.success) {
			console.error(parsedOrderToProduct.error.flatten());
			return;
		}
	}

	insertOrderInDB(parsedOrder.data)
		.then(async () => {
			await insertOrderToProductsInDB(orderToProducts);
		})
		.catch((error) => {
			console.error("Error inserting order", error);
			return { error: "Error inserting order" };
		});

	revalidatePath("/dashboard/orders");
	redirect("/dashboard/orders");
};

export const changeOrderStatus = async (
	_prevState: unknown,
	payload: FormData,
) => {
	const _id = payload.get("_id");

	if (!_id) {
		return { error: "No se ha encontrado el pedido" };
	}

	changeOrderStatusInDB(_id.toString()).catch((error) => {
		console.error("Error changing order status", error);
		return { error: "Error changing order status" };
	});

	revalidatePath("/dashboard/orders");
	redirect("/dashboard/orders");
};
