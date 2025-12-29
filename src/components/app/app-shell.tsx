"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Brain,
	FolderOpen,
	ListTodo,
	BarChart3,
	Settings,
	LogOut,
	Plus,
	ChevronDown,
	Menu,
	X,
} from "lucide-react";

interface Org {
	id: string;
	name: string;
	slug: string;
	role: string;
}

interface AppShellProps {
	user: User;
	orgs: Org[];
	children: React.ReactNode;
}

const navItems = [
	{ href: "/app", label: "Pockets", icon: FolderOpen },
	{ href: "/app/tasks", label: "Tasks", icon: ListTodo },
	{ href: "/app/analytics", label: "Analytics", icon: BarChart3 },
	{ href: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell({ user, orgs, children }: AppShellProps) {
	const pathname = usePathname();
	const router = useRouter();
	const supabase = createClient();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [currentOrg, setCurrentOrg] = useState(orgs[0]);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.push("/");
		router.refresh();
	};

	const getInitials = (name: string | null | undefined) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	return (
		<div className='flex min-h-screen flex-col'>
			{/* Top Navigation */}
			<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='flex h-14 items-center px-4'>
					{/* Mobile menu toggle */}
					<Button
						variant='ghost'
						size='icon'
						className='mr-2 md:hidden'
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className='h-5 w-5' />
						) : (
							<Menu className='h-5 w-5' />
						)}
					</Button>

					{/* Logo */}
					<Link href='/app' className='mr-4 flex items-center space-x-2'>
						<Brain className='h-6 w-6 text-primary' />
						<span className='hidden font-bold md:inline-block'>
							Vedha Pocket
						</span>
					</Link>

					{/* Org Selector */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' className='gap-2'>
								{currentOrg?.name}
								<ChevronDown className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='start'>
							<DropdownMenuLabel>Organizations</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{orgs.map((org) => (
								<DropdownMenuItem
									key={org.id}
									onClick={() => setCurrentOrg(org)}
									className={cn(currentOrg?.id === org.id && "bg-accent")}
								>
									{org.name}
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Plus className='mr-2 h-4 w-4' />
								Create Organization
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Desktop Navigation */}
					<nav className='ml-6 hidden items-center space-x-4 md:flex'>
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
									pathname === item.href
										? "text-foreground"
										: "text-muted-foreground"
								)}
							>
								<item.icon className='h-4 w-4' />
								{item.label}
							</Link>
						))}
					</nav>

					{/* Right side */}
					<div className='ml-auto flex items-center gap-4'>
						{/* User Menu */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='ghost'
									className='relative h-8 w-8 rounded-full'
								>
									<Avatar className='h-8 w-8'>
										<AvatarImage
											src={user.user_metadata?.avatar_url}
											alt={user.user_metadata?.full_name}
										/>
										<AvatarFallback>
											{getInitials(user.user_metadata?.full_name || user.email)}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								<DropdownMenuLabel>
									<div className='flex flex-col space-y-1'>
										<p className='text-sm font-medium leading-none'>
											{user.user_metadata?.full_name || "User"}
										</p>
										<p className='text-xs leading-none text-muted-foreground'>
											{user.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href='/app/settings'>
										<Settings className='mr-2 h-4 w-4' />
										Settings
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleSignOut}>
									<LogOut className='mr-2 h-4 w-4' />
									Sign Out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			{/* Mobile Navigation */}
			{mobileMenuOpen && (
				<div className='fixed inset-0 top-14 z-40 bg-background md:hidden'>
					<ScrollArea className='h-full'>
						<div className='p-4'>
							<nav className='flex flex-col space-y-2'>
								{navItems.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										onClick={() => setMobileMenuOpen(false)}
										className={cn(
											"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
											pathname === item.href
												? "bg-accent text-accent-foreground"
												: "text-muted-foreground"
										)}
									>
										<item.icon className='h-5 w-5' />
										{item.label}
									</Link>
								))}
							</nav>
						</div>
					</ScrollArea>
				</div>
			)}

			{/* Main Content */}
			<main className='flex-1'>
				<div className='container py-6'>{children}</div>
			</main>
		</div>
	);
}
