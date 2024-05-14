"use client";

import { insertClient, updateClient } from "@/actions/client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardBody,
	CardDescription,
	CardFooter,
	CardHeader,
	CardSubtitle,
	CardTitle,
} from "@/components/ui/card";
import Divider from "@/components/ui/divider";
import { Input, InputContainer, InputError } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Client } from "@/db/schemas";
import { useFormState, useFormStatus } from "react-dom";

export default function EditClientForm({ client }: { client: Client }) {
	const [errors, dispatch] = useFormState(updateClient, undefined);

	return (
		<form action={dispatch} className="flex flex-col gap-y-4">
			<CardHeader className="p-0">
				<CardTitle>Editar cliente</CardTitle>
				<CardDescription>
					Los campos marcados con * son obligatorios
				</CardDescription>
			</CardHeader>
			<Card>
				<CardBody>
					<CardSubtitle>Información básica</CardSubtitle>
					<div className="flex flex-col gap-y-4 mt-4">
						<input hidden aria-hidden readOnly name="_id" value={client._id} />
						<InputContainer>
							<Label>Nombre *</Label>
							<Input
								name="name"
								placeholder="Adrian L."
								defaultValue={client.name}
							/>
							{errors?.name && <InputError>{errors.name[0]}</InputError>}
						</InputContainer>
						<InputContainer>
							<Label>Dirección</Label>
							<Input
								name="address"
								placeholder="4 Sur"
								defaultValue={client.address ?? ""}
							/>
							{errors?.address && <InputError>{errors.address[0]}</InputError>}
						</InputContainer>
						<InputContainer>
							<Label>Teléfono</Label>
							<Input
								name="phone"
								placeholder="941 294 1948"
								defaultValue={client.phone ?? ""}
							/>
							{errors?.phone && <InputError>{errors.phone[0]}</InputError>}
						</InputContainer>
					</div>
				</CardBody>
				<Divider />
				<CardFooter className="justify-end gap-x-4">
					<Button variant="outline" type="button">
						Cancelar
					</Button>
					<SubmitButton />
				</CardFooter>
			</Card>
		</form>
	);
}

const SubmitButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Cargando..." : "Guardar cliente"}
		</Button>
	);
};
