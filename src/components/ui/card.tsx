import { cn } from "@/lib/utils";

export function Card({
	children,
	variant = "default",
	className,
}: {
	children: React.ReactNode;
	variant?: "default" | "destructive";
	className?: string;
}) {
	return (
		<section
			className={cn(
				"flex flex-col border border-zinc-700 rounded relative",
				{
					"border-destructive": variant === "destructive",
				},
				className,
			)}
		>
			{children}
		</section>
	);
}

export function CardHeader({
	children,
	className,
}: { children: React.ReactNode; className?: string }) {
	return (
		<header
			className={cn("p-6 flex flex-col justify-center gap-y-1", className)}
		>
			{children}
		</header>
	);
}

export function CardTitle({ children }: { children: React.ReactNode }) {
	return <h3 className="text-2xl font-medium text-balance">{children}</h3>;
}

export function CardSubtitle({ children }: { children: React.ReactNode }) {
	return <h4 className="text-xl font-medium text-zinc-300">{children}</h4>;
}

export function CardDescription({
	children,
	className,
}: { children: React.ReactNode; className?: string }) {
	return (
		<p className={cn("text-zinc-300/60 text-sm text-pretty", className)}>
			{children}
		</p>
	);
}

export function CardBody({
	children,
	className,
}: { children: React.ReactNode; className?: string }) {
	return (
		<article className={cn("p-6 flex flex-col gap-y-2", className)}>
			{children}
		</article>
	);
}

export function CardFooter({
	children,
	className,
}: { children: React.ReactNode; className?: string }) {
	return (
		<footer
			className={cn(
				"bg-zinc-950/50 rounded-b px-6 py-5 flex flex-row items-center",
				className,
			)}
		>
			{children}
		</footer>
	);
}
