import { selectOrder } from "@/actions/order";
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
import { Item, ItemTitle, ItemValue } from "@/components/ui/item";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { OrderType } from "@/constants/order-type";
import { PaymentMethods } from "@/constants/payment-methods";
import { CircleCheck, Clock } from "lucide-react";
import EditForm from "./components/edit-form";

export default async function OrderPage({
	params,
}: { params: { id: string } }) {
	const data = await selectOrder(params.id);

	return (
		<Card>
			<CardHeader className="flex-row justify-start gap-x-4">
				<CardTitle>{data.client.name}</CardTitle>
				<CardDescription className="flex flex-row gap-x-2 items-center">
					{data.delivered ? (
						<CircleCheck className="w-5 h-5" />
					) : (
						<Clock className="w-5 h-5" />
					)}
					{data.delivered ? "Entregado" : "Pendiente"}
				</CardDescription>
			</CardHeader>
			<Divider />
			<CardBody>
				<CardSubtitle>Productos</CardSubtitle>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Producto</TableHead>
							<TableHead>Cantidad</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.products.map((product) => (
							<TableRow key={product._id}>
								<TableCell>{product.name}</TableCell>
								<TableCell>{product.quantity}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardBody>
			<Divider />
			<CardBody>
				<Item>
					<ItemTitle>Entrega</ItemTitle>
					<ItemValue>{OrderType[data.type]}</ItemValue>
				</Item>
				<Item>
					<ItemTitle>Entregar en</ItemTitle>
					<ItemValue>{data.client.address}</ItemValue>
				</Item>
				<Item>
					<ItemTitle>Método de pago</ItemTitle>
					<ItemValue>{PaymentMethods[data.paymentMethod]}</ItemValue>
				</Item>
			</CardBody>
			{!data.delivered && (
				<CardFooter>
					<EditForm id={data._id} />
				</CardFooter>
			)}
		</Card>
	);
}
