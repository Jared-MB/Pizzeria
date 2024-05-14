import { selectOrders } from "@/actions/order";
import { selectProducts } from "@/actions/product";
import Search from "@/components/search";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { CircleCheck, Clock, MoreVertical, NotebookPen } from "lucide-react";
import Link from "next/link";

export default async function OrdersPage({
	searchParams,
}: { searchParams: { page: string } }) {
	const params = new URLSearchParams(searchParams);
	const data = await selectOrders(
		Number(params.get("page")) || 1,
		params.get("name") ?? "",
	);

	return (
		<main>
			<header className="flex flex-row justify-between items-center">
				<h2 className="text-3xl font-medium">Pedidos</h2>
				<div className="flex flex-row gap-x-4 items-center">
					<div className="w-96">
						<Search queryName="name" showLabel={false} />
					</div>
					<Link
						href="/dashboard/orders/upload"
						className={buttonVariants({
							variant: "outline",
							className: "flex flex-row gap-x-2 items-center",
						})}
					>
						<NotebookPen />
						Agregar pedido
					</Link>
				</div>
			</header>
			<Table className="mt-4">
				<TableHeader>
					<TableRow>
						<TableHead>Cliente</TableHead>
						<TableHead>Total</TableHead>
						<TableHead>Estatus</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.orders?.map((order) => (
						<TableRow key={order._id} className="h-fit">
							<TableCell>{order.client.name}</TableCell>
							<TableCell>
								$
								{order.products.reduce(
									// biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
									(acc, current) => acc + current.price * current.quantity,
									0,
								)}
							</TableCell>
							<TableCell>
								<div className="flex gap-x-2">
									{order.delivered ? (
										<CircleCheck className="w-5 h-5" />
									) : (
										<Clock className="w-5 h-5" />
									)}
									{order.delivered ? "Entregado" : "Pendiente"}
								</div>
							</TableCell>
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size="icon">
											<MoreVertical />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuLabel>Acciones</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											<Link
												href={`/dashboard/orders/${order._id}`}
												className="w-full h-full"
											>
												Ver más
											</Link>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href={`?page=${data.page === 1 ? data.page : data.page - 1}`}
						/>
					</PaginationItem>
					{/* <PaginationItem>
						<PaginationLink href="#">1</PaginationLink>
					</PaginationItem>*/}
					<PaginationItem className="px-2">{data.page}</PaginationItem>
					<PaginationItem>
						<PaginationNext
							href={`?page=${data.hasMore ? data.page + 1 : data.page}`}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</main>
	);
}
