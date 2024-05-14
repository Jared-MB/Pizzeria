import { selectClients } from "@/actions/client";
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
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
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
import { MoreVertical, UserPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function ClientsPage({
	searchParams,
}: { searchParams: { page: string } }) {
	const params = new URLSearchParams(searchParams);
	const data = await selectClients(
		Number(params.get("page")) || 1,
		params.get("name") ?? "",
	);

	return (
		<main>
			<header className="flex flex-row justify-between items-center">
				<h2 className="text-3xl font-medium">Clientes</h2>
				<div className="flex flex-row gap-x-4 items-center">
					<div className="w-96">
						<Search queryName="name" showLabel={false} />
					</div>
					<Link
						href="/dashboard/clients/upload"
						className={buttonVariants({
							variant: "outline",
							className: "flex flex-row gap-x-2 items-center",
						})}
					>
						<UserPlus />
						Agregar cliente
					</Link>
				</div>
			</header>
			<Table className="mt-4">
				<TableHeader>
					<TableRow>
						<TableHead>Nombre</TableHead>
						<TableHead>Dirección</TableHead>
						<TableHead>Teléfono</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.clients?.map((client) => (
						<TableRow key={client._id}>
							<TableCell>{client.name}</TableCell>
							<TableCell>{client.address}</TableCell>
							<TableCell>{client.phone}</TableCell>
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
												className="h-full w-full"
												href={`/dashboard/clients/edit?_id=${client._id}`}
											>
												Editar
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
