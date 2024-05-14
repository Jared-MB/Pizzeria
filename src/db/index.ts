import {
	categories,
	clients,
	employees,
	orders,
	ordersRelations,
	ordersToProducts,
	ordersToProductsRelations,
	products,
	productsRelations,
	productsSizesRelations,
	productsToSizes,
	productsToSizesRelations,
	type sizeEnum,
	sizes,
	sizesRelations,
} from "@/db/schemas";
import { sql } from "@vercel/postgres";
import * as bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/vercel-postgres";

import type {
	Client,
	InsertClient,
	InsertOrder,
	InsertOrdersToProducts,
	InsertProductSchema,
	NewEmployee,
	Order,
	SelectProduct,
	paymentMethodEnum,
	typeEnum,
} from "@/db/schemas";
import { count, countDistinct, eq, ilike } from "drizzle-orm";

export const db = drizzle(sql, {
	schema: {
		categories,
		clients,
		employees,
		orders,
		ordersToProducts,
		products,
		ordersRelations,
		productsRelations,
		ordersToProductsRelations,
	},
});

// #region Employee
export const createEmployee = async (employee: NewEmployee) => {
	const hashedPassword = await bcrypt.hash(employee.password, 10);

	await db
		.insert(employees)
		.values({
			...employee,
			password: hashedPassword,
		})
		.returning({
			_id: employees._id,
			name: employees.name,
			username: employees.username,
			role: employees.role,
			permissions: employees.permissions,
		});
};

export const selectEmployeesFromDB = async (page = 1, name?: string) => {
	const skip = (page - 1) * 9;

	const totalEmployees = await db
		.select({ value: count(employees._id) })
		.from(employees);

	let employeesToSend: {
		_id: string;
		name: string;
		username: string;
		role: "ADMIN" | "USER";
		permissions: string;
	}[];

	if (name) {
		employeesToSend = await db
			.select({
				_id: employees._id,
				name: employees.name,
				username: employees.username,
				role: employees.role,
				permissions: employees.permissions,
			})
			.from(employees)
			.where(ilike(employees.name, `%${name}%`))
			.limit(9)
			.offset(skip);
	} else {
		employeesToSend = await db
			.select({
				_id: employees._id,
				name: employees.name,
				username: employees.username,
				role: employees.role,
				permissions: employees.permissions,
			})
			.from(employees)
			.limit(9)
			.offset(skip);
	}

	return {
		employees: employeesToSend,
		totalEmployees: totalEmployees[0].value,
		hasMore: totalEmployees[0].value > skip + 9,
		page: page,
	};
};

export const selectEmployeeFromDB = async (employeeId: string) =>
	await db
		.select({
			_id: employees._id,
			name: employees.name,
			username: employees.username,
			role: employees.role,
			permissions: employees.permissions,
		})
		.from(employees)
		.where(eq(employees._id, employeeId));

export const updateEmployeeInDB = async (employee: Partial<NewEmployee>) =>
	await db
		.update(employees)
		.set(employee)
		.where(eq(employees._id, employee._id as string));

export const getAuthUser = async (username: string, password: string) => {
	const user = await db.query.employees.findFirst({
		where: (user, { eq }) => eq(user.username, username),
	});

	if (!user) {
		throw new Error("Not user found.");
	}

	const isSamePassword = await bcrypt.compare(password, user.password);

	if (!isSamePassword) {
		throw new Error("Password is incorrect.");
	}

	const { password: _password, ...rest } = user;

	return rest;
};

// #region Sizes
export const selectSize = async (size: (typeof sizeEnum.enumValues)[number]) =>
	await db.select().from(sizes).where(eq(sizes.name, size));

// #region ProductsToSizes
export const insertProductToSizes = async (
	productToSizes: typeof productsToSizes.$inferInsert,
) => await db.insert(productsToSizes).values(productToSizes).returning();

// #region Products
export const insertProductInDB = async (
	product: InsertProductSchema,
	sizes: (typeof sizeEnum.enumValues)[number][],
) => {
	const productData = await db.insert(products).values(product).returning({
		_id: products._id,
	});

	const productToSizes = sizes.map(async (size) => ({
		_id: crypto.randomUUID(),
		productId: productData[0]._id,
		sizeId: (await selectSize(size))[0]._id,
	}));

	try {
		const result = await Promise.all(productToSizes);
		await db.insert(productsToSizes).values(result).returning();
	} catch (error) {
		console.error("Error adding product to sizes", error);
		throw error;
	}

	return {
		ok: true,
	};
};

export const updateProductInDB = async (
	product: Partial<InsertProductSchema>,
	productSizes: (typeof sizeEnum.enumValues)[number][],
) => {
	await db
		.update(products)
		.set({ ...product })
		.where(eq(products._id, product._id as string))
		.returning({
			_id: products._id,
		});

	await db
		.delete(productsToSizes)
		.where(eq(productsToSizes.productId, product._id as string));

	const sizesToInsertPromises = productSizes.map(async (size) => {
		const sizes = await selectSize(size);
		const sizeId = sizes[0]._id;

		return {
			_id: crypto.randomUUID(),
			productId: product._id as string,
			sizeId,
		};
	});

	const sizesToInsert = await Promise.all(sizesToInsertPromises);

	try {
		await db.insert(productsToSizes).values(sizesToInsert).returning();
	} catch (error) {
		console.error("Error adding product to sizes", error);
		throw error;
	}

	return {
		ok: true,
	};
};

export const selectProductFromDB = async (productId: string) => {
	const rawProduct = await db
		.select()
		.from(products)
		.where(eq(products._id, productId))
		.innerJoin(productsToSizes, eq(products._id, productsToSizes.productId))
		.leftJoin(sizes, eq(sizes._id, productsToSizes.sizeId));

	const product = rawProduct.map((product) => {
		const size = product.size?.name as (typeof sizeEnum.enumValues)[number];
		const joinedProduct = { ...product.product, sizes: [size] };
		return joinedProduct;
	});

	const productToSend: SelectProduct = {
		...product[0],
		sizes: product.map((p) => p.sizes[0]),
	};

	return productToSend;
};

export const selectProductsFromDB = async (page = 1, name?: string) => {
	const skip = (page - 1) * 9;

	const totalProducts = await db
		.select({ value: countDistinct(products._id) })
		.from(products);

	let rawProducts: {
		product: {
			_id: string;
			name: string;
			price: number;
			description: string | null;
			quantity: number;
		};
		product_to_size: {
			productId: string;
			sizeId: string;
		};
		size: {
			_id: string;
			name: "XS" | "S" | "M" | "L" | "XL" | "XXL";
		} | null;
	}[];

	if (name) {
		rawProducts = await db
			.select()
			.from(products)
			.where(ilike(products.name, `%${name}%`))
			.innerJoin(productsToSizes, eq(products._id, productsToSizes.productId))
			.leftJoin(sizes, eq(sizes._id, productsToSizes.sizeId))
			.limit(9)
			.offset(skip);
	} else {
		rawProducts = await db
			.select()
			.from(products)
			.innerJoin(productsToSizes, eq(products._id, productsToSizes.productId))
			.leftJoin(sizes, eq(sizes._id, productsToSizes.sizeId))
			.limit(9)
			.offset(skip);
	}

	const productsSizeJoined = rawProducts.map((product) => {
		const size = product.size?.name as (typeof sizeEnum.enumValues)[number];
		const joinedProduct = { ...product.product, sizes: [size] };
		return joinedProduct;
	});

	const productsToSend: SelectProduct[] = [];
	for (const product of productsSizeJoined) {
		const productIndex = productsToSend.findIndex((p) => p._id === product._id);
		if (productIndex !== -1) {
			productsToSend[productIndex].sizes.push(product.sizes[0]);
		} else {
			productsToSend.push(product);
		}
	}
	return {
		products: productsToSend,
		totalProducts: totalProducts[0].value,
		hasMore: totalProducts[0].value > skip + 9,
		page: page,
	};
};

export const deleteProductFromDB = async (productId: string) => {
	await db
		.delete(productsToSizes)
		.where(eq(productsToSizes.productId, productId));

	await db.delete(products).where(eq(products._id, productId));

	return {
		ok: true,
	};
};

// #region Clients

export const insertClientInDB = async (client: InsertClient) =>
	await db.insert(clients).values(client);

export const selectClientsFromDB = async (page = 1, name?: string) => {
	const skip = (page - 1) * 9;

	const totalClients = await db
		.select({ value: count(clients._id) })
		.from(clients);

	let clientsToSend: {
		_id: string;
		name: string;
		address: string | null;
		phone: string | null;
	}[];

	if (name) {
		clientsToSend = await db
			.select()
			.from(clients)
			.where(ilike(clients.name, `%${name}%`))
			.limit(9)
			.offset(skip);
	} else {
		clientsToSend = await db.select().from(clients).limit(9).offset(skip);
	}

	return {
		clients: clientsToSend,
		totalClients: totalClients[0].value,
		hasMore: totalClients[0].value > skip + 9,
		page: page,
	};
};

export const selectClientFromDB = async (clientId: string) =>
	await db.select().from(clients).where(eq(clients._id, clientId));

export const updateClientInDB = async (client: Partial<Client>) =>
	await db
		.update(clients)
		.set(client)
		.where(eq(clients._id, client._id as string));

// #region Orders

export const insertOrderInDB = async (order: InsertOrder) =>
	await db.insert(orders).values(order);

export const selectOrdersFromDB = async (page = 1, name?: string) => {
	const skip = (page - 1) * 9;

	const totalOrders = await db
		.select({ value: countDistinct(orders._id) })
		.from(orders);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let rawOrders: any[];

	if (name) {
		rawOrders = await db
			.select()
			.from(orders)
			.where(ilike(clients.name, `%${name}%`))
			.limit(9)
			.offset(skip)
			.leftJoin(ordersToProducts, eq(orders._id, ordersToProducts.orderId))
			.leftJoin(products, eq(products._id, ordersToProducts.productId))
			.leftJoin(clients, eq(clients._id, orders.clientId));
	} else {
		rawOrders = await db
			.select()
			.from(orders)
			.limit(9)
			.offset(skip)
			.leftJoin(ordersToProducts, eq(orders._id, ordersToProducts.orderId))
			.leftJoin(products, eq(products._id, ordersToProducts.productId))
			.leftJoin(clients, eq(clients._id, orders.clientId));
	}

	const groupedOrders = {} as {
		[key: string]: {
			_id: string;
			type: (typeof typeEnum.enumValues)[number];
			paymentMethod: (typeof paymentMethodEnum.enumValues)[number];
			createdAt: Date;
			delivered: boolean;
			client: Client;
			products: SelectProduct[];
		};
	};

	for (const order of rawOrders) {
		if (!groupedOrders[order.order._id]) {
			groupedOrders[order.order._id] = {
				...order.order,
				client: order.client as Client,
				products: [],
			};
		}
		groupedOrders[order.order._id].products.push(
			order.product as SelectProduct,
		);
	}

	return {
		orders: Object.values(groupedOrders),
		totalOrders: totalOrders[0].value,
		hasMore: totalOrders[0].value > skip + 9,
		page: page,
	};
};

export const selectOrderFromDB = async (orderId: string) => {
	const rawOrder = await db
		.select()
		.from(orders)
		.where(eq(orders._id, orderId))
		.leftJoin(ordersToProducts, eq(orders._id, ordersToProducts.orderId))
		.leftJoin(products, eq(products._id, ordersToProducts.productId))
		.leftJoin(clients, eq(clients._id, orders.clientId));

	const groupedOrders = {} as {
		[key: string]: {
			_id: string;
			type: (typeof typeEnum.enumValues)[number];
			paymentMethod: (typeof paymentMethodEnum.enumValues)[number];
			createdAt: Date;
			delivered: boolean;
			client: Client;
			products: SelectProduct[];
		};
	};

	for (const order of rawOrder) {
		if (!groupedOrders[order.order._id]) {
			groupedOrders[order.order._id] = {
				...order.order,
				client: order.client as Client,
				products: [],
			};
		}
		groupedOrders[order.order._id].products.push(
			order.product as SelectProduct,
		);
	}

	return Object.values(groupedOrders)[0];
};

export const changeOrderStatusInDB = async (orderId: string) => {
	await db
		.update(orders)
		.set({ delivered: true })
		.where(eq(orders._id, orderId));
};

// #region OrdersToProducts

export const insertOrderToProductsInDB = async (
	orderToProducts: InsertOrdersToProducts[],
) => await db.insert(ordersToProducts).values(orderToProducts);
