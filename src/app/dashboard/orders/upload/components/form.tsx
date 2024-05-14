"use client";

import { selectClients } from "@/actions/client";
import { insertOrder } from "@/actions/order";
import { insertProduct, selectProducts } from "@/actions/product";
import Search from "@/components/search";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { OrderType } from "@/constants/order-type";
import { PaymentMethods } from "@/constants/payment-methods";
import { sizeEnum } from "@/db/schema/sizes";
import type { paymentMethodEnum, typeEnum } from "@/db/schemas";
import { useCart } from "@/store/useCart";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

export default function UploadOrderForm() {
	const searchParams = useSearchParams();

	const [errors, dispatch] = useFormState(insertOrder, undefined);
	const [values, setValues] = useState<string[]>([]);

	const { data: clients, refetch: refetchClients } = useQuery({
		queryKey: ["clients"],
		queryFn: () => selectClients(1, searchParams.get("client") ?? ""),
	});

	const { data: products, refetch: refetchProducts } = useQuery({
		queryKey: ["products"],
		queryFn: () => selectProducts(1, searchParams.get("product") ?? ""),
	});

	const cart = useCart((state) => state.cart);
	const addProduct = useCart((state) => state.addProduct);
	const removeProduct = useCart((state) => state.removeProduct);
	const setClient = useCart((state) => state.setClient);
	const client = useCart((state) => state.client);
	const paymentMethod = useCart((state) => state.paymentMethod);
	const setPaymentMethod = useCart((state) => state.setPaymentMethod);
	const type = useCart((state) => state.type);
	const setType = useCart((state) => state.setType);

	const clearAll = useCart((state) => state.clearAll);

	const total = useMemo(() => {
		return cart.reduce(
			(acc, product) => acc + product.price * product.quantity,
			0,
		);
	}, [cart]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		refetchClients();
	}, [searchParams.get("client")]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		refetchProducts();
	}, [searchParams.get("product")]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		clearAll();
	}, []);

	useEffect(() => {
		if (errors) {
			const error = Object.entries(errors)[0].flat();
			toast.error(error[1]);
		}
	}, [errors]);

	return (
		<div className="flex flex-col gap-y-4">
			<CardHeader className="p-0">
				<CardTitle>Crear pedido</CardTitle>
				<CardDescription>
					Completa los campos para agregar un nuevo producto a tu inventario.
					Los campos marcados con * son obligatorios
				</CardDescription>
			</CardHeader>
			<Card className="grid grid-cols-[65%_1px_1fr] relative">
				<CardBody className="p-0">
					<div className="flex flex-col gap-y-2 max-h-[50dvh] p-6">
						<header className="grid grid-cols-[1fr_40%]">
							<CardSubtitle>Productos</CardSubtitle>
							<Search queryName="product" showLabel={false} />
						</header>
						<Table>
							<TableBody>
								{products?.products.map((product) => (
									<TableRow
										key={product._id}
										className="cursor-pointer"
										onClick={() =>
											addProduct({
												_id: product._id,
												quantity: 1,
												name: product.name,
												price: product.price,
											})
										}
									>
										<TableCell>{product.name}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<Divider />
					<div className="flex flex-col gap-y-2 max-h-[45dvh] p-6">
						<header className="grid grid-cols-[1fr_40%]">
							<CardSubtitle>Cliente</CardSubtitle>
							<Search queryName="client" showLabel={false} />
						</header>
						<Table>
							<TableBody>
								{clients?.clients?.map((client) => (
									<TableRow
										key={client._id}
										className="cursor-pointer"
										onClick={() => setClient(client)}
									>
										<TableCell>{client.name}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<Divider />
					<div className="flex flex-col gap-y-4 max-h-[45dvh] p-6">
						<header>
							<CardSubtitle>Método de pago</CardSubtitle>
						</header>
						<RadioGroup
							defaultValue="CASH"
							onValueChange={(e) =>
								setPaymentMethod(
									e as (typeof paymentMethodEnum.enumValues)[number],
								)
							}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="CASH" id="CASH" />
								<Label htmlFor="option-one">Efectivo</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="CARD" id="CARD" />
								<Label htmlFor="CARD">Tarjeta</Label>
							</div>
						</RadioGroup>
					</div>
					<Divider />
					<div className="flex flex-col gap-y-4 max-h-[45dvh] p-6">
						<header>
							<CardSubtitle>Consumo</CardSubtitle>
						</header>
						<RadioGroup
							defaultValue="LOCAL"
							onValueChange={(e) =>
								setType(e as (typeof typeEnum.enumValues)[number])
							}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="LOCAL" id="LOCAL" />
								<Label htmlFor="LOCAL">En local</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="DELIVERY" id="DELIVERY" />
								<Label htmlFor="DELIVERY">Envío a domicilio</Label>
							</div>
						</RadioGroup>
					</div>
				</CardBody>
				<div className="h-full w-[0.5px] bg-zinc-700" />
				<form action={dispatch}>
					<CardBody className="sticky -top-4">
						<CardSubtitle>Resumen</CardSubtitle>
						<div>
							<h5 className="font-semibold text-xs">Cliente </h5>
							<div className="flex flex-col">
								<input
									hidden
									aria-hidden
									name="clientId"
									value={client?._id}
									readOnly
								/>
								<span>{client?.name ?? "Sin cliente"}</span>
								<span className="text-sm">{client?.address}</span>
							</div>
						</div>
						<Divider />
						<div>
							<h5 className="font-semibold text-xs">Método de pago</h5>
							<span>{PaymentMethods[paymentMethod]}</span>
							<input
								hidden
								aria-hidden
								name="paymentMethod"
								value={paymentMethod}
								readOnly
							/>
						</div>
						<div>
							<h5 className="font-semibold text-xs">Consumo</h5>
							<span>{OrderType[type]}</span>
							<input hidden aria-hidden name="type" value={type} readOnly />
						</div>
						<Divider />
						<div className="flex flex-col gap-y-2 overflow-y-auto pt-2">
							<h5 className="font-semibold text-xs">Productos</h5>
							{cart.map((product) => (
								<div
									key={product._id}
									className="flex flex-row justify-between"
								>
									<input
										hidden
										aria-hidden
										name={`product-${product._id}`}
										value={`quantity-${product.quantity}`}
										readOnly
									/>
									<div className="flex flex-col gap-y-1">
										<span>{product.name}</span>
										<span className="text-xs text-zinc-400">
											x{product.quantity}
										</span>
									</div>
									<div className="flex flex-row items-center gap-x-4">
										<div className="flex flex-col gap-y-1">
											<span className="text-xs text-zinc-400 text-end">
												${product.price}
											</span>
											<span>${product.price * product.quantity}</span>
										</div>
										<div>
											<button
												type="button"
												onClick={() => removeProduct(product._id)}
											>
												<X className="w-4 h-4 text-rose-500" />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
						<Divider />
						<div className="flex flex-row justify-between mb-4">
							<span>Total</span>
							<span>${total}</span>
						</div>
						<SubmitButton disabled={total === 0} />
					</CardBody>
				</form>
			</Card>
		</div>
	);
}

const SubmitButton = ({ disabled }: { disabled: boolean }) => {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending || disabled}>
			{pending ? "Cargando..." : "Crear pedido"}
		</Button>
	);
};
