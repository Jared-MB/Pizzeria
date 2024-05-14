import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type React from "react";
import NavLink from "./components/nav-link";

import {
	Briefcase,
	LayoutDashboard,
	LogOut,
	NotepadText,
	Package,
	Users,
} from "lucide-react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-dvh">
			<header className="h-16 p-4 flex items-center border-b-[1px] border-b-zinc-300/10">
				<h1 className="text-purple-500 text-3xl ">
					<Link href="/dashboard">Sabores en sincronía</Link>
				</h1>
			</header>
			<div className="grid grid-cols-[15dvw_1fr] h-[calc(100dvh-4rem)]">
				<aside className="border-r border-r-zinc-300/10 p-8 flex flex-col justify-between">
					<nav>
						<ul className="flex flex-col gap-y-5">
							{/* <NavLink icon={<LayoutDashboard />} href="/dashboard">
								Dashboard
							</NavLink> */}
							<NavLink icon={<Package />} href="/dashboard/products">
								Productos
							</NavLink>
							<NavLink icon={<Users />} href="/dashboard/clients">
								Clientes
							</NavLink>
							<NavLink icon={<Briefcase />} href="/dashboard/employees">
								Empleados
							</NavLink>
							<NavLink href="/dashboard/orders" icon={<NotepadText />}>
								Pedidos
							</NavLink>
						</ul>
					</nav>
					<form
						action={async () => {
							"use server";
							await signOut({
								redirectTo: "/login",
							});
						}}
					>
						<button
							className="text-zinc-400 flex items-center gap-x-2 relative hover:text-purple-400 transition-colors"
							type="submit"
						>
							<LogOut />
							Cerrar sesión
						</button>
					</form>
				</aside>
				<div className="p-8 h-[calc(100dvh-4rem)] overflow-auto relative">
					{children}
				</div>
			</div>
		</div>
	);
}
