"use client";

import { deleteProduct, insertProduct, updateProduct } from "@/actions/product";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "@/components/ui/dialog";
import Divider from "@/components/ui/divider";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input, InputContainer, InputError } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { sizeEnum } from "@/db/schema/sizes";
import type { SelectProduct } from "@/db/schemas";
import { DollarSign } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

export default function EditProductForm({
	product,
}: { product: SelectProduct }) {
	const [errors, dispatch] = useFormState(updateProduct, undefined);
	const [values, setValues] = useState<string[]>(product.sizes);

	return (
		<form action={dispatch} className="flex flex-col gap-y-4">
			<CardHeader className="p-0">
				<CardTitle>Editar producto</CardTitle>
				<CardDescription>
					Editar los campos de un producto de tu inventario. Los campos marcados
					con * son obligatorios
				</CardDescription>
			</CardHeader>
			<Card>
				<CardBody>
					<CardSubtitle>Información básica</CardSubtitle>
					<div className="flex flex-row gap-x-4 items-start">
						<input
							defaultValue={product._id}
							name="_id"
							readOnly
							hidden
							aria-hidden
						/>
						<InputContainer>
							<Label>Nombre *</Label>
							<Input
								name="name"
								placeholder="Pizza de pepperoni"
								defaultValue={product.name}
							/>
							{errors?.name && <InputError>{errors.name[0]}</InputError>}
						</InputContainer>
						<InputContainer>
							<Label>Descripción</Label>
							<Input
								name="description"
								placeholder="Pizza de pepperoni con queso mozzarella"
								defaultValue={product.description ?? ""}
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
									defaultValue={product.price}
								/>
								{errors?.price && <InputError>{errors.price[0]}</InputError>}
							</InputContainer>
							<InputContainer>
								<Label>Cantidad *</Label>
								<Input
									name="quantity"
									type="number"
									placeholder="100"
									defaultValue={product.quantity}
								/>
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
				<CardFooter className="justify-between">
					{/* <Dialog>
						<DialogTrigger asChild>
							<Button variant="destructive">Eliminar</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								¿Estás seguro de eliminar este producto?
							</DialogHeader>
							<DialogDescription>
								Una vez eliminado, no podrás recuperar la información de este
								producto.
							</DialogDescription>
							<form action={deleteProduct}>
								<input
									readOnly
									hidden
									aria-hidden
									value={product._id}
									name="_id"
								/>
								<DialogFooter>
									<Button variant="outline" type="button">
										Cancelar
									</Button>
									<Button variant="destructive" type="submit">
										Eliminar
									</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog> */}
					<div className="flex flex-row gap-x-4 items-center">
						<Link
							className={buttonVariants({
								variant: "outline",
							})}
							href="/dashboard/products"
						>
							Cancelar
						</Link>
						<SubmitButton />
					</div>
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
