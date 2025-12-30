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
	Sparkles,
	Settings,
	LogOut,
	ChevronDown,
	Menu,
	X,
	PanelLeftClose,
	PanelLeft,
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
	{ href: "/app", label: "Memories", icon: Sparkles },
	{ href: "/app/pockets", label: "Pockets", icon: FolderOpen },
	{ href: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell({ user, orgs, children }: AppShellProps) {
	const pathname = usePathname();
	const router = useRouter();
	const supabase = createClient();
	const [sidebarOpen, setSidebarOpen] = useState(true);
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
		<div className='flex h-screen overflow-hidden'>
			{/* Desktop Sidebar */}
			<aside
				className={cn(
					"hidden md:flex flex-col border-r bg-background transition-all duration-300",
					sidebarOpen ? "w-64" : "w-16"
				)}
			>
				{/* Logo */}
				<div className='flex h-14 items-center px-4 border-b'>
					<Link href='/app' className='flex items-center gap-2'>
						<Brain className='h-6 w-6 text-primary shrink-0' />
						{sidebarOpen && (
							<span className='font-bold text-lg'>Memory Palace</span>
						)}
					</Link>
				</div>

				{/* Org Selector */}
				{sidebarOpen && (
					<div className='p-4'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='outline'
									className='w-full justify-between gap-2'
								>
									<span className='truncate'>{currentOrg?.name}</span>
									<ChevronDown className='h-4 w-4 shrink-0' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='start' className='w-56'>
								<DropdownMenuLabel>Workspaces</DropdownMenuLabel>
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
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)}

				{/* Navigation */}
				<ScrollArea className='flex-1 px-3'>
					<nav className='flex flex-col gap-1 py-2'>
						{navItems.map((item) => {
							const isActive =
								item.href === "/app"
									? pathname === "/app" || pathname.startsWith("/app/memory")
									: pathname.startsWith(item.href);
							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
										isActive
											? "bg-accent text-accent-foreground"
											: "text-muted-foreground",
										!sidebarOpen && "justify-center"
									)}
									title={!sidebarOpen ? item.label : undefined}
								>
									<item.icon className='h-5 w-5 shrink-0' />
									{sidebarOpen && <span>{item.label}</span>}
								</Link>
							);
						})}
					</nav>
				</ScrollArea>

				{/* Bottom section */}
				<div className='border-t p-3'>
					{/* Toggle sidebar button */}
					<Button
						variant='ghost'
						size='icon'
						className={cn("w-full", sidebarOpen && "justify-start px-3")}
						onClick={() => setSidebarOpen(!sidebarOpen)}
					>
						{sidebarOpen ? (
							<>
								<PanelLeftClose className='h-5 w-5' />
								<span className='ml-3 text-sm'>Collapse</span>
							</>
						) : (
							<PanelLeft className='h-5 w-5' />
						)}
					</Button>

					<Separator className='my-3' />

					{/* User menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								className={cn(
									"w-full",
									sidebarOpen ? "justify-start px-3" : "px-0 justify-center"
								)}
							>
								<Avatar className='h-8 w-8 shrink-0'>
									<AvatarImage
										src={user.user_metadata?.avatar_url}
										alt={user.user_metadata?.full_name}
									/>
									<AvatarFallback>
										{getInitials(user.user_metadata?.full_name || user.email)}
									</AvatarFallback>
								</Avatar>
								{sidebarOpen && (
									<div className='ml-3 flex flex-col items-start text-left'>
										<span className='text-sm font-medium truncate max-w-[140px]'>
											{user.user_metadata?.full_name || "User"}
										</span>
										<span className='text-xs text-muted-foreground truncate max-w-[140px]'>
											{user.email}
										</span>
									</div>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-56'>
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
			</aside>

			{/* Mobile Header */}
			<div className='flex flex-1 flex-col overflow-hidden'>
				<header className='md:hidden sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className='h-5 w-5' />
						) : (
							<Menu className='h-5 w-5' />
						)}
					</Button>
					<Link href='/app' className='flex items-center gap-2'>
						<Brain className='h-6 w-6 text-primary' />
						<span className='font-bold'>Memory Palace</span>
					</Link>
					<div className='ml-auto'>
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
				</header>

				{/* Mobile Navigation Overlay */}
				{mobileMenuOpen && (
					<div className='md:hidden fixed inset-0 top-14 z-40 bg-background'>
						<ScrollArea className='h-full'>
							<div className='p-4'>
								{/* Org selector */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='outline'
											className='w-full justify-between'
										>
											{currentOrg?.name}
											<ChevronDown className='h-4 w-4' />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className='w-full'>
										{orgs.map((org) => (
											<DropdownMenuItem
												key={org.id}
												onClick={() => setCurrentOrg(org)}
											>
												{org.name}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>

								<Separator className='my-4' />

								<nav className='flex flex-col gap-1'>
									{navItems.map((item) => {
										const isActive =
											item.href === "/app"
												? pathname === "/app"
												: pathname.startsWith(item.href);
										return (
											<Link
												key={item.href}
												href={item.href}
												onClick={() => setMobileMenuOpen(false)}
												className={cn(
													"flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent",
													isActive
														? "bg-accent text-accent-foreground"
														: "text-muted-foreground"
												)}
											>
												<item.icon className='h-5 w-5' />
												{item.label}
											</Link>
										);
									})}
								</nav>
							</div>
						</ScrollArea>
					</div>
				)}

				{/* Main Content */}
				<main className='flex-1 overflow-hidden h-full'>
					<div className='h-full px-8 py-4 max-w-[90rem] mx-auto overflow-hidden'>
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
