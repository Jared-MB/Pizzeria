"use server";

import {
	createEmployee,
	selectEmployeeFromDB,
	selectEmployeesFromDB,
	updateEmployeeInDB,
} from "@/db";
import { insertEmployeeSchema, updateEmployeeSchema } from "@/db/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const selectEmployees = async (page: number, name?: string) =>
	await selectEmployeesFromDB(page, name);

export const selectEmployee = async (id: string) =>
	(await selectEmployeeFromDB(id))[0];

export const updateEmployee = async (
	_prevState: unknown,
	payload: FormData,
) => {
	const employee = Object.fromEntries(payload.entries());

	const parsedData = updateEmployeeSchema.safeParse(employee);

	if (!parsedData.success) {
		console.log("Error updating employee", parsedData.error.flatten());
		return parsedData.error.flatten().fieldErrors;
	}

	updateEmployeeInDB(parsedData.data).catch((error) => {
		console.error("Error updating employee", error);
		return { error: "Error updating employee" };
	});

	revalidatePath("/dashboard/employees");
	redirect("/dashboard/employees");
};

export const insertEmployee = async (
	_prevState: unknown,
	payload: FormData,
): Promise<{
	_id?: string[] | undefined;
	name?: string[] | undefined;
	username?: string[] | undefined;
	password?: string[] | undefined;
	confirmPassword?: string[] | undefined;
	role?: string[] | undefined;
	permissions?: string[] | undefined;
	error?: string | undefined;
}> => {
	const employee = Object.fromEntries(payload.entries());

	const password = employee.password.toString();
	const confirmPassword = employee.confirmPassword.toString();

	if (password !== confirmPassword) {
		return { confirmPassword: ["Las contraseñas no coinciden"] };
	}

	const _id = crypto.randomUUID();
	employee._id = _id;
	employee.permissions = "all";

	const parsedData = insertEmployeeSchema.safeParse(employee);

	console.log("Parsed data", parsedData);

	if (!parsedData.success) {
		return parsedData.error.flatten().fieldErrors;
	}

	console.log("Inserting employee", parsedData.data);

	createEmployee(parsedData.data).catch((error) => {
		console.error("Error inserting employee", error);
		return { error: "Error inserting employee" };
	});

	console.log("Employee inserted");

	revalidatePath("/dashboard/employees");
	redirect("/dashboard/employees");
};
