"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Key, ExternalLink, AlertTriangle } from "lucide-react";

interface ApiKeySetupModalProps {
	open: boolean;
}

export function ApiKeySetupModal({ open }: ApiKeySetupModalProps) {
	const router = useRouter();
	const [apiKey, setApiKey] = useState("");
	const [showKey, setShowKey] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const saveKeyMutation = useMutation({
		mutationFn: async (key: string) => {
			const result = await api.updateSettings({ openrouter_api_key: key });
			return result;
		},
		onSuccess: () => {
			// Refresh the page to update the layout check
			router.refresh();
		},
		onError: (err: Error) => {
			setError(err.message || "Failed to save API key. Please try again.");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!apiKey.trim()) {
			setError("Please enter your OpenRouter API key");
			return;
		}

		if (!apiKey.startsWith("sk-or-")) {
			setError("Invalid API key format. OpenRouter keys start with 'sk-or-'");
			return;
		}

		saveKeyMutation.mutate(apiKey.trim());
	};

	return (
		<Dialog open={open} onOpenChange={() => {}}>
			<DialogContent
				className='sm:max-w-md'
				onPointerDownOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Key className='h-5 w-5 text-primary' />
						OpenRouter API Key Required
					</DialogTitle>
					<DialogDescription>
						To use Memory Palace, you need to provide your own OpenRouter API
						key. Your key is encrypted and stored securely.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className='space-y-4'>
						<Alert className='border-amber-500/50 bg-amber-50 dark:bg-amber-950/20'>
							<AlertTriangle className='h-4 w-4 text-amber-600' />
							<AlertDescription className='text-sm'>
								This app is open source and requires you to bring your own API
								key. We don&apos;t provide shared API access.
							</AlertDescription>
						</Alert>

						<div className='space-y-2'>
							<Label htmlFor='apiKey'>OpenRouter API Key</Label>
							<div className='relative'>
								<Input
									id='apiKey'
									type={showKey ? "text" : "password"}
									placeholder='sk-or-v1-...'
									value={apiKey}
									onChange={(e) => setApiKey(e.target.value)}
									className='pr-20'
									autoComplete='off'
								/>
								<Button
									type='button'
									variant='ghost'
									size='sm'
									className='absolute right-1 top-1 h-7 text-xs'
									onClick={() => setShowKey(!showKey)}
								>
									{showKey ? "Hide" : "Show"}
								</Button>
							</div>
						</div>

						{error && (
							<Alert variant='destructive'>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className='text-sm text-muted-foreground'>
							<p>Don&apos;t have an API key?</p>
							<a
								href='https://openrouter.ai/keys'
								target='_blank'
								rel='noopener noreferrer'
								className='inline-flex items-center gap-1 text-primary hover:underline'
							>
								Get one from OpenRouter <ExternalLink className='h-3 w-3' />
							</a>
							<p className='mt-2 text-xs'>
								Typical costs: ~$0.0001/1K tokens for embeddings, varies for
								chat.
							</p>
						</div>
					</div>

					<DialogFooter className='mt-6'>
						<form action='/api/auth/signout' method='POST'>
							<Button type='submit' variant='outline'>
								Sign Out
							</Button>
						</form>
						<Button
							type='submit'
							disabled={saveKeyMutation.isPending || !apiKey.trim()}
						>
							{saveKeyMutation.isPending && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							Save & Continue
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
