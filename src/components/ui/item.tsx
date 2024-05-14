export function Item({ children }: { children: React.ReactNode }) {
	return <div className="flex flex-col gap-y-0.5">{children}</div>;
}

export function ItemTitle({ children }: { children: React.ReactNode }) {
	return <h4 className="text-lg font-medium">{children}</h4>;
}

export function ItemValue({ children }: { children: React.ReactNode }) {
	return <p className="text-zinc-300/60 text-sm capitalize">{children}</p>;
}
