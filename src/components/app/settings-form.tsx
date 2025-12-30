"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Key, Palette, User as UserIcon, ExternalLink, Check } from "lucide-react";

interface UserSettings {
	theme: "light" | "dark" | "system";
	openrouter_api_key_encrypted?: string;
}

interface SettingsFormProps {
	user: User;
	settings: UserSettings;
}

export function SettingsForm({
	user,
	settings: initialSettings,
}: SettingsFormProps) {
	const router = useRouter();
	const [settings, setSettings] = useState(initialSettings);
	const [apiKey, setApiKey] = useState("");
	const [showApiKey, setShowApiKey] = useState(false);

	const updateSettingsMutation = useMutation({
		mutationFn: (
			data: Partial<UserSettings> & { openrouter_api_key?: string }
		) => api.updateSettings(data),
		onSuccess: () => {
			toast({ title: "Settings saved" });
			router.refresh();
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to save settings",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const handleThemeChange = (theme: "light" | "dark" | "system") => {
		setSettings({ ...settings, theme });
		updateSettingsMutation.mutate({ theme });

		// Update document theme
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else if (theme === "light") {
			document.documentElement.classList.remove("dark");
		} else {
			// System preference
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}
	};

	const handleSaveApiKey = () => {
		if (!apiKey.trim()) {
			toast({
				title: "API key required",
				description: "Please enter your OpenRouter API key",
				variant: "destructive",
			});
			return;
		}
		if (!apiKey.startsWith("sk-or-")) {
			toast({
				title: "Invalid API key",
				description: "OpenRouter API keys start with 'sk-or-'",
				variant: "destructive",
			});
			return;
		}
		updateSettingsMutation.mutate({
			openrouter_api_key: apiKey,
		});
		setApiKey("");
		setShowApiKey(false);
	};

	const handleRemoveApiKey = () => {
		updateSettingsMutation.mutate({
			openrouter_api_key: "",
		});
	};

	return (
		<div className='space-y-6'>
			{/* Profile */}
			<Card>
				<CardHeader>
					<div className='flex items-center gap-2'>
						<UserIcon className='h-5 w-5 text-primary' />
						<CardTitle>Profile</CardTitle>
					</div>
					<CardDescription>Your account information</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='grid gap-2'>
						<Label>Email</Label>
						<Input value={user.email || ""} disabled />
					</div>
					<div className='grid gap-2'>
						<Label>Name</Label>
						<Input value={user.user_metadata?.full_name || ""} disabled />
						<p className='text-xs text-muted-foreground'>
							Name is managed by your authentication provider
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Appearance */}
			<Card>
				<CardHeader>
					<div className='flex items-center gap-2'>
						<Palette className='h-5 w-5 text-primary' />
						<CardTitle>Appearance</CardTitle>
					</div>
					<CardDescription>Customize how the app looks</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid gap-2'>
						<Label>Theme</Label>
						<Select value={settings.theme} onValueChange={handleThemeChange}>
							<SelectTrigger className='w-48'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='light'>Light</SelectItem>
								<SelectItem value='dark'>Dark</SelectItem>
								<SelectItem value='system'>System</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* API Key */}
			<Card>
				<CardHeader>
					<div className='flex items-center gap-2'>
						<Key className='h-5 w-5 text-primary' />
						<CardTitle>OpenRouter API Key</CardTitle>
					</div>
					<CardDescription>
						Your API key for AI-powered features (chat, embeddings)
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{settings.openrouter_api_key_encrypted ? (
						<div className='rounded-lg border border-green-500/50 bg-green-50 p-4 dark:bg-green-950/20'>
							<div className='flex items-center gap-2 text-green-700 dark:text-green-400'>
								<Check className='h-5 w-5' />
								<span className='font-medium'>API Key Configured</span>
							</div>
							<p className='mt-1 text-sm text-muted-foreground'>
								Your OpenRouter API key is securely stored and encrypted.
							</p>
						</div>
					) : (
						<div className='rounded-lg border border-amber-500/50 bg-amber-50 p-4 dark:bg-amber-950/20'>
							<p className='text-sm text-amber-700 dark:text-amber-400'>
								No API key configured. Add your OpenRouter API key to use chat features.
							</p>
						</div>
					)}

					<div className='grid gap-2'>
						<Label>{settings.openrouter_api_key_encrypted ? "Update API Key" : "API Key"}</Label>
						<div className='flex gap-2'>
							<Input
								type={showApiKey ? "text" : "password"}
								placeholder='sk-or-v1-...'
								value={apiKey}
								onChange={(e) => setApiKey(e.target.value)}
							/>
							<Button
								variant='outline'
								onClick={() => setShowApiKey(!showApiKey)}
							>
								{showApiKey ? "Hide" : "Show"}
							</Button>
						</div>
						<p className='text-xs text-muted-foreground'>
							Get your API key from{" "}
							<a
								href='https://openrouter.ai/keys'
								target='_blank'
								rel='noopener noreferrer'
								className='inline-flex items-center gap-1 text-primary hover:underline'
							>
								openrouter.ai/keys
								<ExternalLink className='h-3 w-3' />
							</a>
							. Your key is encrypted before storage.
						</p>
					</div>
					<div className='flex gap-2'>
						<Button
							onClick={handleSaveApiKey}
							disabled={updateSettingsMutation.isPending || !apiKey.trim()}
						>
							{updateSettingsMutation.isPending && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							{settings.openrouter_api_key_encrypted ? "Update API Key" : "Save API Key"}
						</Button>
						{settings.openrouter_api_key_encrypted && (
							<Button
								variant='outline'
								onClick={handleRemoveApiKey}
								disabled={updateSettingsMutation.isPending}
							>
								Remove Key
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Danger Zone */}
			<Card className='border-destructive'>
				<CardHeader>
					<CardTitle className='text-destructive'>Danger Zone</CardTitle>
					<CardDescription>
						Irreversible and destructive actions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button variant='destructive' disabled>
						Delete Account
					</Button>
					<p className='mt-2 text-xs text-muted-foreground'>
						Contact support to delete your account and all associated data.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
