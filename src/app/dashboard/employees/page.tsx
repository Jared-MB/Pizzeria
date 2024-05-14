import { selectClients } from "@/actions/client";
import { selectEmployees } from "@/actions/employee";
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
import { MoreVertical, UserPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function EmployeesPage({
	searchParams,
}: { searchParams: { page: string } }) {
	const params = new URLSearchParams(searchParams);
	const data = await selectEmployees(
		Number(params.get("page")) || 1,
		params.get("name") ?? "",
	);

	return (
		<main>
			<header className="flex flex-row justify-between items-center">
				<h2 className="text-3xl font-medium">Empleados</h2>
				<div className="flex flex-row gap-x-4 items-center">
					<div className="w-96">
						<Search queryName="name" showLabel={false} />
					</div>
					<Link
						href="/dashboard/employees/upload"
						className={buttonVariants({
							variant: "outline",
							className: "flex flex-row gap-x-2 items-center",
						})}
					>
						<UserPlus />
						Agregar empleado
					</Link>
				</div>
			</header>
			<Table className="mt-4">
				<TableHeader>
					<TableRow>
						<TableHead>Nombre</TableHead>
						<TableHead>Usuario</TableHead>
						<TableHead>Rol</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.employees?.map((employee) => (
						<TableRow key={employee._id}>
							<TableCell>{employee.name}</TableCell>
							<TableCell>{employee.username}</TableCell>
							<TableCell>{employee.role}</TableCell>
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
												className="w-full h-full"
												href={`/dashboard/employees/edit?_id=${employee._id}`}
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
