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
	Shield,
	Lock,
	Eye,
	Database,
	Key,
	Server,
	FileCheck,
} from "lucide-react";

const securityFeatures = [
	{
		icon: Lock,
		title: "Encryption at Rest",
		description:
			"All data stored in our database is encrypted using AES-256 encryption. This includes your documents, URLs, and any extracted content.",
	},
	{
		icon: Shield,
		title: "Encryption in Transit",
		description:
			"All data transmitted between your browser and our servers uses TLS 1.3 encryption. API communications are always HTTPS.",
	},
	{
		icon: Database,
		title: "Row-Level Security",
		description:
			"PostgreSQL RLS policies ensure complete data isolation. Users can only access data within their organizations and pockets.",
	},
	{
		icon: Key,
		title: "API Key Encryption",
		description:
			"BYO API keys are encrypted with AES-256-GCM before storage. Keys are decrypted only when making API calls.",
	},
	{
		icon: Eye,
		title: "Audit Logging",
		description:
			"All sensitive operations are logged for compliance. Team plan includes full audit trail with user attribution.",
	},
	{
		icon: Server,
		title: "Secure Infrastructure",
		description:
			"Hosted on Vercel, Railway, and Supabase with SOC 2 compliance. Regular security updates and monitoring.",
	},
];

const compliance = [
	{
		title: "Data Residency",
		description:
			"Data is stored in US-based data centers. Contact us for EU data residency requirements.",
	},
	{
		title: "Data Retention",
		description:
			"You control your data. Delete pockets, sources, or your entire account at any time with immediate effect.",
	},
	{
		title: "Third-Party Access",
		description:
			"We never share your data with third parties. LLM providers only see the context needed for your queries.",
	},
	{
		title: "Incident Response",
		description:
			"We have documented incident response procedures and will notify affected users within 72 hours of any breach.",
	},
];

export default function SecurityPage() {
	return (
		<div className='flex min-h-screen flex-col'>
			{/* Header */}
			<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='container flex h-14 items-center'>
					<div className='mr-4 flex'>
						<Link href='/' className='mr-6 flex items-center space-x-2'>
							<Brain className='h-6 w-6 text-primary' />
							<span className='font-bold'>Memory Palace</span>
						</Link>
					</div>
					<div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
						<nav className='flex items-center space-x-6 text-sm font-medium'>
							<Link
								href='/security'
								className='text-foreground transition-colors'
							>
								Security
							</Link>
							<Link
								href='/privacy'
								className='transition-colors hover:text-foreground/80'
							>
								Privacy
							</Link>
							<Link
								href='/terms'
								className='transition-colors hover:text-foreground/80'
							>
								Terms
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
						<Shield className='h-16 w-16 text-primary' />
						<h1 className='font-heading text-3xl leading-[1.1] sm:text-4xl md:text-6xl'>
							Security First
						</h1>
						<p className='max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7'>
							Your knowledge is valuable. We take security seriously with
							enterprise-grade protection for all users.
						</p>
					</div>
				</section>

				{/* Security Features */}
				<section className='container pb-12 md:pb-24'>
					<div className='mx-auto grid max-w-[80rem] gap-6 md:grid-cols-2 lg:grid-cols-3'>
						{securityFeatures.map((feature) => (
							<Card key={feature.title}>
								<CardHeader>
									<feature.icon className='h-10 w-10 text-primary' />
									<CardTitle className='mt-4'>{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>{feature.description}</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* Compliance & Policies */}
				<section className='border-t bg-slate-50 dark:bg-transparent'>
					<div className='container py-12 md:py-24'>
						<div className='mx-auto max-w-[58rem] space-y-8'>
							<div className='text-center'>
								<h2 className='font-heading text-3xl leading-[1.1]'>
									Compliance & Policies
								</h2>
								<p className='mt-4 text-muted-foreground'>
									Transparent policies to protect your data and privacy.
								</p>
							</div>
							<div className='grid gap-6 md:grid-cols-2'>
								{compliance.map((item) => (
									<Card key={item.title}>
										<CardHeader>
											<CardTitle className='text-lg'>{item.title}</CardTitle>
										</CardHeader>
										<CardContent>
											<CardDescription>{item.description}</CardDescription>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Security Practices */}
				<section className='container py-12 md:py-24'>
					<div className='mx-auto max-w-[58rem] space-y-8'>
						<div className='text-center'>
							<h2 className='font-heading text-3xl leading-[1.1]'>
								Our Security Practices
							</h2>
						</div>
						<div className='space-y-6'>
							<div className='flex items-start gap-4'>
								<FileCheck className='mt-1 h-6 w-6 shrink-0 text-primary' />
								<div>
									<h3 className='font-medium'>Regular Security Audits</h3>
									<p className='text-sm text-muted-foreground'>
										We conduct regular security reviews and penetration testing
										to identify and address vulnerabilities.
									</p>
								</div>
							</div>
							<div className='flex items-start gap-4'>
								<FileCheck className='mt-1 h-6 w-6 shrink-0 text-primary' />
								<div>
									<h3 className='font-medium'>Dependency Monitoring</h3>
									<p className='text-sm text-muted-foreground'>
										Automated scanning for vulnerable dependencies with rapid
										patching of critical issues.
									</p>
								</div>
							</div>
							<div className='flex items-start gap-4'>
								<FileCheck className='mt-1 h-6 w-6 shrink-0 text-primary' />
								<div>
									<h3 className='font-medium'>Secure Development</h3>
									<p className='text-sm text-muted-foreground'>
										All code changes go through security review. We follow OWASP
										guidelines for secure development.
									</p>
								</div>
							</div>
							<div className='flex items-start gap-4'>
								<FileCheck className='mt-1 h-6 w-6 shrink-0 text-primary' />
								<div>
									<h3 className='font-medium'>Employee Access</h3>
									<p className='text-sm text-muted-foreground'>
										Principle of least privilege. Production access is limited
										and audited. No employee can access your data without
										authorization.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Contact */}
				<section className='border-t bg-slate-50 dark:bg-transparent'>
					<div className='container flex flex-col items-center gap-4 py-12 text-center md:py-16'>
						<h2 className='font-heading text-2xl leading-[1.1] sm:text-3xl'>
							Security Questions?
						</h2>
						<p className='max-w-[42rem] leading-normal text-muted-foreground'>
							If you have security concerns or want to report a vulnerability,
							please contact us.
						</p>
						<Button variant='outline'>security@vedha.llc</Button>
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
						<Link href='/security' className='hover:underline font-medium'>
							Security
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
