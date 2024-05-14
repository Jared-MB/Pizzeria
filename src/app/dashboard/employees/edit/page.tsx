import { selectEmployee } from "@/actions/employee";
import EditEmployeeForm from "./components/edit-employees-form";

export default async function EmployeePage({
	searchParams,
}: { searchParams: string }) {
	const params = new URLSearchParams(searchParams);

	const employee = await selectEmployee(params.get("_id") ?? "");

	return <EditEmployeeForm employee={employee} />;
}
