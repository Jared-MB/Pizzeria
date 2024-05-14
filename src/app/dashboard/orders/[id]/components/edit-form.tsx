"use client";

import { changeOrderStatus } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";

export default function EditForm({ id }: { id: string }) {
	const [errors, dispatch] = useFormState(changeOrderStatus, undefined);

	return (
		<form action={dispatch}>
			<input hidden aria-hidden readOnly name="_id" value={id} />
			<SubmitButton />
		</form>
	);
}

const SubmitButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Cargando..." : "Finalizar pedido"}
		</Button>
	);
};
