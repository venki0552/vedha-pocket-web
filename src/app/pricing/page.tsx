import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle2 } from "lucide-react";

const plans = [
	{
		name: "Free",
		description: "Perfect for getting started",
		price: "$0",
		period: "forever",
		features: [
			"1 Pocket",
			"50 Sources",
			"100 Questions/month",
			"5MB file upload limit",
			"Community support",
		],
		limitations: ["Single user only", "No BYO API key", "Basic analytics"],
		cta: "Get Started",
		popular: false,
	},
	{
		name: "Pro",
		description: "For power users and professionals",
		price: "$10",
		period: "/month",
		features: [
			"10 Pockets",
			"500 Sources",
			"1,000 Questions/month",
			"10MB file upload limit",
			"BYO OpenRouter API key",
			"Priority email support",
			"Advanced analytics",
			"Export data",
		],
		limitations: [],
		cta: "Start Pro Trial",
		popular: true,
	},
	{
		name: "Team",
		description: "For teams and organizations",
		price: "$25",
		period: "/seat/month",
		features: [
			"Unlimited Pockets",
			"Unlimited Sources",
			"Unlimited Questions",
			"50MB file upload limit",
			"BYO API key (per user)",
			"Team management",
			"Role-based access control",
			"Audit logs",
			"Priority support",
			"SSO (coming soon)",
		],
		limitations: [],
		cta: "Contact Sales",
		popular: false,
	},
];

export default function PricingPage() {
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
								className='text-foreground transition-colors'
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
				{/* Hero */}
				<section className='container py-12 md:py-24'>
					<div className='mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center'>
						<h1 className='font-heading text-3xl leading-[1.1] sm:text-4xl md:text-6xl'>
							Simple, Transparent Pricing
						</h1>
						<p className='max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7'>
							Choose the plan that works best for you. All plans include core
							features with no hidden fees.
						</p>
					</div>
				</section>

				{/* Pricing Cards */}
				<section className='container pb-12 md:pb-24'>
					<div className='mx-auto grid max-w-[80rem] gap-8 md:grid-cols-3'>
						{plans.map((plan) => (
							<Card
								key={plan.name}
								className={plan.popular ? "border-2 border-primary" : ""}
							>
								<CardHeader>
									<div className='flex items-center justify-between'>
										<CardTitle>{plan.name}</CardTitle>
										{plan.popular && <Badge>Most Popular</Badge>}
									</div>
									<CardDescription>{plan.description}</CardDescription>
								</CardHeader>
								<CardContent className='space-y-6'>
									<div>
										<span className='text-4xl font-bold'>{plan.price}</span>
										<span className='text-muted-foreground'>{plan.period}</span>
									</div>
									<div className='space-y-2'>
										<p className='text-sm font-medium'>What's included:</p>
										{plan.features.map((feature) => (
											<div key={feature} className='flex items-center gap-2'>
												<CheckCircle2 className='h-4 w-4 text-green-500' />
												<span className='text-sm'>{feature}</span>
											</div>
										))}
									</div>
									{plan.limitations.length > 0 && (
										<div className='space-y-2'>
											<p className='text-sm font-medium text-muted-foreground'>
												Limitations:
											</p>
											{plan.limitations.map((limitation) => (
												<div
													key={limitation}
													className='flex items-center gap-2'
												>
													<span className='h-4 w-4 text-center text-muted-foreground'>
														•
													</span>
													<span className='text-sm text-muted-foreground'>
														{limitation}
													</span>
												</div>
											))}
										</div>
									)}
								</CardContent>
								<CardFooter>
									<Link href='/login?signup=true' className='w-full'>
										<Button
											className='w-full'
											variant={plan.popular ? "default" : "outline"}
										>
											{plan.cta}
										</Button>
									</Link>
								</CardFooter>
							</Card>
						))}
					</div>
				</section>

				{/* FAQ Section */}
				<section className='border-t bg-slate-50 dark:bg-transparent'>
					<div className='container py-12 md:py-24'>
						<div className='mx-auto max-w-[58rem] space-y-8'>
							<div className='text-center'>
								<h2 className='font-heading text-3xl leading-[1.1]'>
									Frequently Asked Questions
								</h2>
							</div>
							<div className='grid gap-6 md:grid-cols-2'>
								<div className='space-y-2'>
									<h3 className='font-medium'>What is a Pocket?</h3>
									<p className='text-sm text-muted-foreground'>
										A Pocket is a container for your sources. Think of it as a
										folder or project that groups related URLs and documents
										together.
									</p>
								</div>
								<div className='space-y-2'>
									<h3 className='font-medium'>What counts as a Source?</h3>
									<p className='text-sm text-muted-foreground'>
										Each URL you save or file you upload counts as one source.
										Sources are processed and chunked for semantic search.
									</p>
								</div>
								<div className='space-y-2'>
									<h3 className='font-medium'>What is BYO API Key?</h3>
									<p className='text-sm text-muted-foreground'>
										Bring Your Own API key lets you use your OpenRouter API key
										for unlimited questions. Your key is encrypted at rest.
									</p>
								</div>
								<div className='space-y-2'>
									<h3 className='font-medium'>Can I upgrade or downgrade?</h3>
									<p className='text-sm text-muted-foreground'>
										Yes! You can change your plan at any time. Upgrades take
										effect immediately, and downgrades apply at the next billing
										cycle.
									</p>
								</div>
								<div className='space-y-2'>
									<h3 className='font-medium'>
										What file types are supported?
									</h3>
									<p className='text-sm text-muted-foreground'>
										We support PDF, DOCX, DOC, and TXT files. More formats
										coming soon including Markdown and HTML.
									</p>
								</div>
								<div className='space-y-2'>
									<h3 className='font-medium'>Is my data secure?</h3>
									<p className='text-sm text-muted-foreground'>
										Yes! All data is encrypted at rest and in transit. We use
										row-level security to ensure data isolation between users.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className='border-t py-6 md:py-0'>
				<div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
					<div className='flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0'>
						<Brain className='h-6 w-6 text-primary' />
						<p className='text-center text-sm leading-loose text-muted-foreground md:text-left'>
							Built by Vedha LLC.
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
