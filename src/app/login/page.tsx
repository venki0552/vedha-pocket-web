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
import { Brain, Github, Loader2 } from "lucide-react";
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
			const { error } = await supabase.auth.signUp({
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
			} else {
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

	const handleGithubLogin = async () => {
		setIsLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "github",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});

			if (error) {
				toast({
					title: "Error",
					description: error.message,
					variant: "destructive",
				});
				setIsLoading(false);
			}
		} catch {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
			setIsLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		setIsLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});

			if (error) {
				toast({
					title: "Error",
					description: error.message,
					variant: "destructive",
				});
				setIsLoading(false);
			}
		} catch {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
			setIsLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-background'>
			<Link href='/' className='mb-8 flex items-center space-x-2'>
				<Brain className='h-8 w-8 text-primary' />
				<span className='text-2xl font-bold'>Vedha Pocket</span>
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
								<div className='relative w-full'>
									<div className='absolute inset-0 flex items-center'>
										<span className='w-full border-t' />
									</div>
									<div className='relative flex justify-center text-xs uppercase'>
										<span className='bg-background px-2 text-muted-foreground'>
											Or continue with
										</span>
									</div>
								</div>
								<div className='grid w-full grid-cols-2 gap-4'>
									<Button
										type='button'
										variant='outline'
										onClick={handleGithubLogin}
										disabled={isLoading}
									>
										<Github className='mr-2 h-4 w-4' />
										GitHub
									</Button>
									<Button
										type='button'
										variant='outline'
										onClick={handleGoogleLogin}
										disabled={isLoading}
									>
										<svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
											<path
												fill='currentColor'
												d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
											/>
											<path
												fill='currentColor'
												d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
											/>
											<path
												fill='currentColor'
												d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
											/>
											<path
												fill='currentColor'
												d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
											/>
										</svg>
										Google
									</Button>
								</div>
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
