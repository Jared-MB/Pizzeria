"use client";

import { Input, InputContainer } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const WAIT_BETWEEN_TYPING = 400;

export default function Search({
	showLabel = true,
	queryName,
	placeholder = "Buscar...",
	resetPage = true,
}: {
	showLabel?: boolean;
	queryName: string;
	placeholder?: string;
	resetPage?: boolean;
}) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const search = useDebouncedCallback((value: string) => {
		const query = new URLSearchParams(searchParams);
		query.set(queryName, value);
		if (!value) query.delete(queryName);
		if (resetPage) {
			query.set("page", "1");
		}
		replace(`${pathname}?${query.toString()}`);
	}, WAIT_BETWEEN_TYPING);

	return (
		<InputContainer
			classNames={{
				container: "max-w-sm",
			}}
		>
			{showLabel && <Label htmlFor="search">Buscar</Label>}
			<Input
				id="search"
				icon={<SearchIcon />}
				placeholder={placeholder}
				defaultValue={searchParams.get(queryName) ?? ""}
				onChange={(e) => search(e.target.value)}
			/>
		</InputContainer>
	);
}
