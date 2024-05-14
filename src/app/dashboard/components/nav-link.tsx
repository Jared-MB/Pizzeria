"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
	href,
	children,
	icon,
}: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
	const pathname = usePathname();

	const isActive = pathname === href;

	return (
		<Link
			href={href}
			className={cn(
				"text-zinc-400 flex items-center gap-x-2 relative hover:text-purple-400 transition-colors",
				isActive && "text-purple-500",
			)}
		>
			{icon}
			{children}
			{isActive && (
				<motion.div
					className="h-full w-[2px] absolute -left-2 bg-purple-500"
					layoutId="nav-link"
				/>
			)}
		</Link>
	);
}

interface MenuLinkProps {
	href: string;
	children: React.ReactNode;
	icon?: React.ReactNode;
}

export const menuLinkClass = "flex items-center gap-x-2";

export const MenuLink = ({ children, href, icon }: MenuLinkProps) => {
	return (
		<Link href={href} className={menuLinkClass}>
			{icon}
			{children}
		</Link>
	);
};
