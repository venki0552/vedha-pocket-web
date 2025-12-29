import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Brain,
	FileText,
	Link2,
	Search,
	Shield,
	Zap,
	CheckCircle2,
	ArrowRight,
} from "lucide-react";

export default function HomePage() {
	return (
		<div className='flex min-h-screen flex-col'>
			{/* Header */}
			<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='container flex h-14 items-center'>
					<div className='mr-4 flex'>
						<Link href='/' className='mr-6 flex items-center space-x-2'>
							<Brain className='h-6 w-6 text-primary' />
							<span className='font-bold'>Vedha Pocket</span>
						</Link>
					</div>
					<div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
						<nav className='flex items-center space-x-6 text-sm font-medium'>
							<Link
								href='/pricing'
								className='transition-colors hover:text-foreground/80'
							>
								Pricing
							</Link>
							<Link
								href='/security'
								className='transition-colors hover:text-foreground/80'
							>
								Security
							</Link>
						</nav>
						<div className='flex items-center space-x-2'>
							<Link href='/login'>
								<Button variant='ghost'>Sign In</Button>
							</Link>
							<Link href='/login?signup=true'>
								<Button>Get Started</Button>
							</Link>
						</div>
					</div>
				</div>
			</header>

			<main className='flex-1'>
				{/* Hero Section */}
				<section className='space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32'>
					<div className='container flex max-w-[64rem] flex-col items-center gap-4 text-center'>
						<h1 className='font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl'>
							Your AI-Powered
							<span className='text-primary'> Second Brain</span>
						</h1>
						<p className='max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8'>
							Save URLs, upload documents, and chat with your knowledge base.
							Get instant answers with citations from your curated sources.
						</p>
						<div className='space-x-4'>
							<Link href='/login?signup=true'>
								<Button size='lg' className='gap-2'>
									Start Free <ArrowRight className='h-4 w-4' />
								</Button>
							</Link>
							<Link href='#features'>
								<Button variant='outline' size='lg'>
									Learn More
								</Button>
							</Link>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section
					id='features'
					className='container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24'
				>
					<div className='mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center'>
						<h2 className='font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl'>
							Features
						</h2>
						<p className='max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7'>
							Everything you need to build and query your personal knowledge
							base.
						</p>
					</div>
					<div className='mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3'>
						<Card>
							<CardHeader>
								<Link2 className='h-10 w-10 text-primary' />
								<CardTitle className='mt-4'>Save Any URL</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>
									Save web pages, articles, and documentation. We extract and
									index the content automatically.
								</CardDescription>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<FileText className='h-10 w-10 text-primary' />
								<CardTitle className='mt-4'>Upload Documents</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>
									Upload PDFs, Word docs, and text files. Support for up to 10MB
									per file with smart chunking.
								</CardDescription>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<Search className='h-10 w-10 text-primary' />
								<CardTitle className='mt-4'>Hybrid Search</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>
									Find anything instantly with our hybrid semantic and full-text
									search powered by pgvector.
								</CardDescription>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<Brain className='h-10 w-10 text-primary' />
								<CardTitle className='mt-4'>AI Chat</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>
									Ask questions and get answers grounded in your sources. Every
									response includes citations.
								</CardDescription>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<Shield className='h-10 w-10 text-primary' />
								<CardTitle className='mt-4'>Multi-Tenant</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>
									Create organizations and invite team members. Granular access
									control with row-level security.
								</CardDescription>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<Zap className='h-10 w-10 text-primary' />
								<CardTitle className='mt-4'>Background Tasks</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription>
									Track ingestion progress in real-time. Retry failed tasks with
									one click.
								</CardDescription>
							</CardContent>
						</Card>
					</div>
				</section>

				{/* Pricing Preview */}
				<section className='container py-8 md:py-12 lg:py-24'>
					<div className='mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center'>
						<h2 className='font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl'>
							Simple Pricing
						</h2>
						<p className='max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7'>
							Start free, scale as you grow.
						</p>
					</div>
					<div className='mx-auto mt-8 grid max-w-[64rem] gap-8 md:grid-cols-3'>
						<Card>
							<CardHeader>
								<CardTitle>Free</CardTitle>
								<div className='text-3xl font-bold'>$0</div>
								<CardDescription>For personal use</CardDescription>
							</CardHeader>
							<CardContent className='space-y-2'>
								<div className='flex items-center gap-2'>
									<CheckCircle2 className='h-4 w-4 text-green-500' />
									<span className='text-sm'>1 Pocket</span>
								</div>
								<div className='flex items-center gap-2'>
									<CheckCircle2 className='h-4 w-4 text-green-500' />
									<span className='text-sm'>50 Sources</span>
								</div>
								<div className='flex items-center gap-2'>
									<CheckCircle2 className='h-4 w-4 text-green-500' />
									<span className='text-sm'>100 Questions/month</span>
								</div>
							</CardContent>
						</Card>
						<Card className='border-primary'>
							<CardHeader>
								<CardTitle>Pro</CardTitle>
								<div className='text-3xl font-bold'>$10</div>
								<CardDescription>For power users</CardDescription>
							</CardHeader>
							<CardContent className='space-y-2'>
								<div className='flex items-center gap-2'>
									<CheckCircle2 className='h-4 w-4 text-green-500' />
									<span className='text-sm'>10 Pockets</span>
								</div>
								<div className='flex items-center gap-2'>
									<CheckCircle2 className='h-4 w-4 text-green-500' />
									<span className='text-sm'>500 Sources</span>
								</div>
								<div className='flex items-center gap-2'>
									<CheckCircle2 className='h-4 w-4 text-green-500' />
									<span className='text-sm'>1,000 Questions/month</span>
								</div>
								<div className='flex items-center gap-2'>
									<CheckCircle2 className='h-4 w-4 text-green-500' />
									<span className='text-sm'>BYO API Key</span>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Team</CardTitle>
								<div className='text-3xl font-bold'>$25</div>
								<CardDescription>Per seat/month</CardDescription>
							</CardHeader>
							<CardContent className='space-y-2'>
								<div className='flex items-center gap-2'>
									<CheckCircle2 className='h-4 w-4 text-green-500' />
									<span className='text-sm'>Unlimited Pockets</span>
								</div>
								<div className='flex items-center gap-2'>
									<CheckCircle2 className='h-4 w-4 text-green-500' />
									<span className='text-sm'>Unlimited Sources</span>
								</div>
								<div className='flex items-center gap-2'>
									<CheckCircle2 className='h-4 w-4 text-green-500' />
									<span className='text-sm'>Priority Support</span>
								</div>
								<div className='flex items-center gap-2'>
									<CheckCircle2 className='h-4 w-4 text-green-500' />
									<span className='text-sm'>Audit Logs</span>
								</div>
							</CardContent>
						</Card>
					</div>
					<div className='mt-8 text-center'>
						<Link href='/pricing'>
							<Button variant='outline'>View Full Pricing</Button>
						</Link>
					</div>
				</section>

				{/* CTA Section */}
				<section className='border-t bg-slate-50 dark:bg-transparent'>
					<div className='container flex flex-col items-center gap-4 py-12 text-center md:py-16 lg:py-20'>
						<h2 className='font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl'>
							Ready to Build Your Second Brain?
						</h2>
						<p className='max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7'>
							Start organizing your knowledge today. Free to get started, no
							credit card required.
						</p>
						<Link href='/login?signup=true'>
							<Button size='lg' className='gap-2'>
								Get Started Free <ArrowRight className='h-4 w-4' />
							</Button>
						</Link>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className='border-t py-6 md:py-0'>
				<div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
					<div className='flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0'>
						<Brain className='h-6 w-6 text-primary' />
						<p className='text-center text-sm leading-loose text-muted-foreground md:text-left'>
							Built by Vedha LLC. The source code is available on GitHub.
						</p>
					</div>
					<div className='flex gap-4 text-sm text-muted-foreground'>
						<Link href='/privacy' className='hover:underline'>
							Privacy
						</Link>
						<Link href='/terms' className='hover:underline'>
							Terms
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
