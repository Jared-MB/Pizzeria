import * as bcrypt from "bcryptjs";
import { db } from "../db";
import { type NewEmployee, employees, sizeEnum, sizes } from "../db/schemas";

const seedAdmin = async () => {
	const employeeId = crypto.randomUUID();

	const username = process.env.ADMIN_EMPLOYEE_SEED_USERNAME;
	const password = process.env.ADMIN_EMPLOYEE_SEED_PASSWORD;

	if (!password || !username) {
		console.error("No password or username provided to seed admin user");
		return;
	}

	const hashPasswd = await bcrypt.hash(password, 10);

	const adminEmployee: NewEmployee = {
		_id: employeeId,
		name: "Admin",
		username: username,
		password: hashPasswd,
		role: "ADMIN",
		permissions: "all",
	};

	try {
		const user = await db.insert(employees).values(adminEmployee).returning();
		console.log("Admin user created", user);
	} catch (error) {
		console.error("Error creating admin user", error);
	}
};

const seedSizes = async () => {
	const sizesArray = sizeEnum.enumValues.map((size) => ({
		_id: crypto.randomUUID(),
		name: size,
	}));

	try {
		const result = await db.insert(sizes).values(sizesArray).returning();
		console.log("Sizes added", result);
	} catch (error) {
		console.error("Error adding sizes", error);
	}
};

seedAdmin()
	.then(() => {
		console.log("Seed admin completed");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Seed admin failed", error);
		process.exit(1);
	});

seedSizes()
	.then(() => {
		console.log("Seed sizes completed");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Seed sizes failed", error);
		process.exit(1);
	});
