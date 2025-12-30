"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiKeySetupModal } from "./api-key-setup-modal";

interface ApiKeyGuardProps {
	children: React.ReactNode;
	initialHasKey: boolean;
}

export function ApiKeyGuard({ children, initialHasKey }: ApiKeyGuardProps) {
	const [showModal, setShowModal] = useState(!initialHasKey);

	// Re-check on mount and when coming back to the page
	const { data: settings, isLoading } = useQuery({
		queryKey: ["settings"],
		queryFn: () => api.getSettings(),
		staleTime: 0, // Always refetch
		refetchOnMount: true,
		refetchOnWindowFocus: true,
	});

	useEffect(() => {
		if (settings?.data) {
			setShowModal(!settings.data.has_openrouter_key);
		}
	}, [settings]);

	// Show modal if no API key
	if (showModal && !isLoading) {
		return (
			<>
				{children}
				<ApiKeySetupModal open={true} />
			</>
		);
	}

	return <>{children}</>;
}
