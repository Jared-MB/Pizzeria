"use client";

import { insertProduct } from "@/actions/product";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { sizeEnum } from "@/db/schema/sizes";
import { DollarSign } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

export default function UploadProductPage() {
	const [errors, dispatch] = useFormState(insertProduct, undefined);
	const [values, setValues] = useState<string[]>([]);

	return (
		<form action={dispatch} className="flex flex-col gap-y-4">
			<CardHeader className="p-0">
				<CardTitle>Agregar producto</CardTitle>
				<CardDescription>
					Completa los campos para agregar un nuevo producto a tu inventario.
					Los campos marcados con * son obligatorios
				</CardDescription>
			</CardHeader>
			<Card>
				<CardBody>
					<CardSubtitle>Información básica</CardSubtitle>
					<div className="flex flex-row gap-x-4 items-start">
						<InputContainer>
							<Label>Nombre *</Label>
							<Input name="name" placeholder="Pizza de pepperoni" />
							{errors?.name && <InputError>{errors.name[0]}</InputError>}
						</InputContainer>
						<InputContainer>
							<Label>Descripción</Label>
							<Input
								name="description"
								placeholder="Pizza de pepperoni con queso mozzarella"
							/>
							{errors?.description && (
								<InputError>{errors.description[0]}</InputError>
							)}
						</InputContainer>
					</div>
				</CardBody>
				<Divider />
				<div className="grid grid-cols-[65%_1px_1fr]">
					<CardBody>
						<CardSubtitle>Precios y stock</CardSubtitle>
						<div className="flex flex-row gap-x-4 items-start">
							<InputContainer>
								<Label>Precio *</Label>
								<Input
									icon={<DollarSign className="w-4 h-4" />}
									name="price"
									type="number"
									placeholder="100.00"
								/>
								{errors?.price && <InputError>{errors.price[0]}</InputError>}
							</InputContainer>
							<InputContainer>
								<Label>Cantidad *</Label>
								<Input name="quantity" type="number" placeholder="100" />
								{errors?.quantity && (
									<InputError>{errors.quantity[0]}</InputError>
								)}
							</InputContainer>
						</div>
					</CardBody>
					<div className="w-[1px] bg-zinc-700 h-full" />
					<CardBody>
						<CardSubtitle>Tamaños</CardSubtitle>
						<InputContainer>
							<Label>Selecciona los tamaños disponibles *</Label>
							<ToggleGroup
								value={values}
								onValueChange={setValues}
								className="justify-start gap-x-2"
								type="multiple"
							>
								{sizeEnum.enumValues.map((size) => (
									<ToggleGroupItem variant="outline" key={size} value={size}>
										<input
											readOnly
											hidden
											disabled={!values.includes(size)}
											aria-hidden
											value={size}
											name={`size_${size}`}
										/>
										{size}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
							{errors?.sizes && <InputError>{errors.sizes[0]}</InputError>}
						</InputContainer>
					</CardBody>
				</div>
				<Divider />
				<CardFooter className="justify-end gap-x-4">
					<Link
						className={buttonVariants({
							variant: "outline",
						})}
						href="/dashboard/products"
					>
						Cancelar
					</Link>
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
			{pending ? "Cargando..." : "Agregar producto"}
		</Button>
	);
};
