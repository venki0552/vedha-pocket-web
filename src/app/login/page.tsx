"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const supabase = createClient();

	const isSignup = searchParams.get("signup") === "true";
	const [activeTab, setActiveTab] = useState(isSignup ? "signup" : "login");

	useEffect(() => {
		setActiveTab(isSignup ? "signup" : "login");
	}, [isSignup]);

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				toast({
					title: "Error",
					description: error.message,
					variant: "destructive",
				});
			} else {
				router.push("/app");
				router.refresh();
			}
		} catch {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleEmailSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						full_name: name,
					},
				},
			});

			if (error) {
				toast({
					title: "Error",
					description: error.message,
					variant: "destructive",
				});
			} else if (data.session) {
				// Email confirmation is disabled - user is logged in directly
				router.push("/app");
				router.refresh();
			} else if (data.user && !data.session) {
				// Email confirmation is enabled - show message
				toast({
					title: "Check your email",
					description:
						"We sent you a confirmation link to verify your account.",
				});
			}
		} catch {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-background'>
			<Link href='/' className='mb-8 flex items-center space-x-2'>
				<Brain className='h-8 w-8 text-primary' />
				<span className='text-2xl font-bold'>Memory Palace</span>
			</Link>

			<Card className='w-full max-w-md'>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<CardHeader>
						<TabsList className='grid w-full grid-cols-2'>
							<TabsTrigger value='login'>Sign In</TabsTrigger>
							<TabsTrigger value='signup'>Sign Up</TabsTrigger>
						</TabsList>
					</CardHeader>

					<TabsContent value='login'>
						<form onSubmit={handleEmailLogin}>
							<CardContent className='space-y-4'>
								<CardDescription className='text-center'>
									Welcome back! Sign in to your account.
								</CardDescription>
								<div className='space-y-2'>
									<Label htmlFor='login-email'>Email</Label>
									<Input
										id='login-email'
										type='email'
										placeholder='you@example.com'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										disabled={isLoading}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='login-password'>Password</Label>
									<Input
										id='login-password'
										type='password'
										placeholder='••••••••'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										disabled={isLoading}
									/>
								</div>
								<div className='text-right'>
									<Link
										href='/forgot-password'
										className='text-sm text-muted-foreground hover:text-primary'
									>
										Forgot password?
									</Link>
								</div>
							</CardContent>
							<CardFooter className='flex flex-col space-y-4'>
								<Button type='submit' className='w-full' disabled={isLoading}>
									{isLoading && (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									)}
									Sign In
								</Button>
							</CardFooter>
						</form>
					</TabsContent>

					<TabsContent value='signup'>
						<form onSubmit={handleEmailSignup}>
							<CardContent className='space-y-4'>
								<CardDescription className='text-center'>
									Create your account to get started.
								</CardDescription>
								<div className='space-y-2'>
									<Label htmlFor='signup-name'>Full Name</Label>
									<Input
										id='signup-name'
										type='text'
										placeholder='John Doe'
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
										disabled={isLoading}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='signup-email'>Email</Label>
									<Input
										id='signup-email'
										type='email'
										placeholder='you@example.com'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										disabled={isLoading}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='signup-password'>Password</Label>
									<Input
										id='signup-password'
										type='password'
										placeholder='••••••••'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										minLength={8}
										disabled={isLoading}
									/>
									<p className='text-xs text-muted-foreground'>
										Minimum 8 characters
									</p>
								</div>
							</CardContent>
							<CardFooter className='flex flex-col space-y-4'>
								<Button type='submit' className='w-full' disabled={isLoading}>
									{isLoading && (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									)}
									Create Account
								</Button>
								<p className='text-center text-xs text-muted-foreground'>
									By signing up, you agree to our{" "}
									<Link href='/terms' className='underline hover:text-primary'>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href='/privacy'
										className='underline hover:text-primary'
									>
										Privacy Policy
									</Link>
									.
								</p>
							</CardFooter>
						</form>
					</TabsContent>
				</Tabs>
			</Card>
		</div>
	);
}
