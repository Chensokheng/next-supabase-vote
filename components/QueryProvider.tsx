"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

// Create a client

export default function QueryProvider({ children }: { children: ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		// Provide the client to your App
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}
