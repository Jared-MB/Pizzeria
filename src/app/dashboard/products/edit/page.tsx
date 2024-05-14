import { selectProductFromDB } from "@/db";
import { redirect } from "next/navigation";
import EditProductForm from "./components/edit-product-form";

export default async function UploadProductPage({
	searchParams,
}: {
	searchParams: URLSearchParams;
}) {
	const params = new URLSearchParams(searchParams);
	const _id = params.get("_id");

	if (!_id) {
		redirect("/dashboard/products");
	}

	const product = await selectProductFromDB(_id);

	return <EditProductForm product={product} />;
}
