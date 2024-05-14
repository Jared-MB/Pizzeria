import { selectClient } from "@/actions/client";
import { selectClientFromDB } from "@/db";
import EditClientForm from "./components/edit-client-form";

export default async function ClientPage({
	searchParams,
}: { searchParams: string }) {
	const params = new URLSearchParams(searchParams);

	const client = await selectClient(params.get("_id") ?? "");

	return <EditClientForm client={client} />;
}
