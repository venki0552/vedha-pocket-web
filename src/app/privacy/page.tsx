import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export default function PrivacyPage() {
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
								className='transition-colors hover:text-foreground/80'
							>
								Security
							</Link>
							<Link
								href='/privacy'
								className='text-foreground transition-colors'
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
				<div className='container max-w-4xl py-12 md:py-24'>
					<h1 className='font-heading text-4xl font-bold mb-2'>
						Privacy Policy
					</h1>
					<p className='text-muted-foreground mb-8'>
						Last updated: December 30, 2025
					</p>

					<div className='prose prose-gray dark:prose-invert max-w-none space-y-8'>
						<section>
							<h2 className='text-2xl font-semibold mb-4'>1. Introduction</h2>
							<p className='text-muted-foreground leading-relaxed'>
								Memory Palace (&quot;we,&quot; &quot;our,&quot; or
								&quot;us&quot;) is operated by Vedha LLC. This Privacy Policy
								explains how we collect, use, disclose, and safeguard your
								information when you use our service at memorypalace.app (the
								&quot;Service&quot;). We are committed to protecting your
								privacy and handling your data with transparency.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								2. Information We Collect
							</h2>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								2.1 Account Information
							</h3>
							<p className='text-muted-foreground leading-relaxed mb-4'>
								When you create an account, we collect:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2'>
								<li>Email address (required for authentication)</li>
								<li>
									Name (from OAuth provider if you sign in with Google/GitHub)
								</li>
								<li>Profile picture (from OAuth provider, optional)</li>
								<li>Authentication tokens (managed by Supabase Auth)</li>
							</ul>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								2.2 User Content
							</h3>
							<p className='text-muted-foreground leading-relaxed mb-4'>
								You create and store the following content in Memory Palace:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2'>
								<li>
									<strong>Memories:</strong> Notes, thoughts, and text content
									you create
								</li>
								<li>
									<strong>Pockets:</strong> Collections of documents and URLs
									for knowledge organization
								</li>
								<li>
									<strong>Documents:</strong> PDFs, text files, and other
									uploaded documents
								</li>
								<li>
									<strong>URLs:</strong> Web pages you save for later reference
								</li>
								<li>
									<strong>Chat History:</strong> Questions you ask and
									AI-generated responses
								</li>
								<li>
									<strong>Tags and Organization:</strong> Labels, colors, and
									folder structures
								</li>
								<li>
									<strong>Comments:</strong> Annotations on shared memories
								</li>
							</ul>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								2.3 Technical Data
							</h3>
							<p className='text-muted-foreground leading-relaxed mb-4'>
								We automatically collect:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2'>
								<li>
									Usage analytics via Vercel Analytics (page views, web vitals)
								</li>
								<li>Error logs for debugging and service improvement</li>
								<li>
									Audit logs for security (login events, data access patterns)
								</li>
								<li>IP addresses (for rate limiting and abuse prevention)</li>
							</ul>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								2.4 API Keys (Optional)
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								If you choose to bring your own OpenRouter API key, we encrypt
								it using AES-256-GCM before storage. The key is only decrypted
								when making API calls on your behalf and is never logged or
								transmitted elsewhere.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								3. How We Use Your Information
							</h2>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2'>
								<li>
									<strong>Provide the Service:</strong> Store, organize, and
									retrieve your memories and documents
								</li>
								<li>
									<strong>AI Features:</strong> Generate embeddings for semantic
									search and provide AI chat responses
								</li>
								<li>
									<strong>Authentication:</strong> Verify your identity and
									secure your account
								</li>
								<li>
									<strong>Communication:</strong> Send essential service
									notifications (security alerts, password resets)
								</li>
								<li>
									<strong>Improvement:</strong> Analyze usage patterns to
									improve features and performance
								</li>
								<li>
									<strong>Security:</strong> Detect and prevent abuse, fraud,
									and security threats
								</li>
							</ul>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>4. Data Sharing</h2>
							<p className='text-muted-foreground leading-relaxed mb-4'>
								We do NOT sell your personal data. We share data only in these
								circumstances:
							</p>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								4.1 Third-Party Service Providers
							</h3>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2'>
								<li>
									<strong>Supabase:</strong> Database hosting and authentication
									(data stored in their US infrastructure)
								</li>
								<li>
									<strong>Vercel:</strong> Web hosting and analytics
									(aggregated, privacy-focused)
								</li>
								<li>
									<strong>Railway:</strong> API and worker hosting
								</li>
								<li>
									<strong>OpenRouter:</strong> AI/LLM API provider (receives
									only the content needed for your specific queries)
								</li>
							</ul>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								4.2 AI Processing
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								When you use AI features, relevant portions of your content are
								sent to OpenRouter&apos;s API (which routes to various LLM
								providers like OpenAI, Anthropic, Google). Only the minimum
								context needed for your query is shared. We do not use your
								content to train AI models.
							</p>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								4.3 Legal Requirements
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								We may disclose information if required by law, subpoena, or
								other legal process, or if we believe disclosure is necessary to
								protect our rights, your safety, or the safety of others.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>5. Data Security</h2>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2'>
								<li>
									<strong>Encryption at Rest:</strong> All data encrypted using
									AES-256
								</li>
								<li>
									<strong>Encryption in Transit:</strong> TLS 1.3 for all
									communications
								</li>
								<li>
									<strong>Row-Level Security:</strong> PostgreSQL RLS ensures
									complete data isolation between users
								</li>
								<li>
									<strong>API Key Encryption:</strong> Your OpenRouter keys are
									encrypted with AES-256-GCM
								</li>
								<li>
									<strong>Access Controls:</strong> Strict internal access
									policies and audit logging
								</li>
							</ul>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>6. Data Retention</h2>
							<p className='text-muted-foreground leading-relaxed mb-4'>
								We retain your data as long as your account is active. You can:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2'>
								<li>
									Delete individual memories, pockets, or documents at any time
								</li>
								<li>Archive content instead of deleting</li>
								<li>
									Request complete account deletion (contact security@vedha.llc)
								</li>
							</ul>
							<p className='text-muted-foreground leading-relaxed mt-4'>
								Upon account deletion, all your data is permanently removed
								within 30 days, except where required for legal compliance.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>7. Your Rights</h2>
							<p className='text-muted-foreground leading-relaxed mb-4'>
								Depending on your location, you may have the following rights:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2'>
								<li>
									<strong>Access:</strong> Request a copy of your data
								</li>
								<li>
									<strong>Correction:</strong> Update inaccurate information
								</li>
								<li>
									<strong>Deletion:</strong> Request removal of your data
								</li>
								<li>
									<strong>Portability:</strong> Export your data in a
									machine-readable format
								</li>
								<li>
									<strong>Objection:</strong> Object to certain processing
									activities
								</li>
							</ul>
							<p className='text-muted-foreground leading-relaxed mt-4'>
								To exercise these rights, contact us at privacy@vedha.llc
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								8. Cookies and Tracking
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								We use essential cookies for authentication and session
								management. Vercel Analytics collects anonymized, aggregated
								data about page views and web performance. We do not use
								advertising cookies or sell data to ad networks.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								9. Children&apos;s Privacy
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								Memory Palace is not intended for users under 13 years of age.
								We do not knowingly collect personal information from children.
								If you believe a child has provided us with personal data,
								please contact us immediately.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								10. International Data Transfers
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								Your data is stored in US-based data centers. By using our
								Service, you consent to the transfer of your data to the United
								States. For EU data residency requirements, please contact us.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								11. Changes to This Policy
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								We may update this Privacy Policy from time to time. We will
								notify you of significant changes by email or through the
								Service. Your continued use after changes constitutes acceptance
								of the updated policy.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>12. Contact Us</h2>
							<p className='text-muted-foreground leading-relaxed'>
								If you have questions about this Privacy Policy or our data
								practices:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2 mt-4'>
								<li>Email: privacy@vedha.llc</li>
								<li>Security concerns: security@vedha.llc</li>
							</ul>
						</section>
					</div>
				</div>
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
						<Link href='/privacy' className='hover:underline font-medium'>
							Privacy
						</Link>
						<Link href='/terms' className='hover:underline'>
							Terms
						</Link>
						<Link href='/security' className='hover:underline'>
							Security
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
