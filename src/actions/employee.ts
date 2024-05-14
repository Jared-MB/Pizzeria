"use server";

import { createEmployee, selectEmployeesFromDB } from "@/db";
import { insertEmployeeSchema } from "@/db/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const selectEmployees = async (page: number, name?: string) =>
	await selectEmployeesFromDB(page, name);

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
