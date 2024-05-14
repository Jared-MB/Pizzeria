"use client";

import UploadOrderForm from "./components/form";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";

const queryClient = new QueryClient();

export default function UploadOrderPage() {
	return (
		<QueryClientProvider client={queryClient}>
			<Suspense>
				<UploadOrderForm />
			</Suspense>
		</QueryClientProvider>
	);
}
