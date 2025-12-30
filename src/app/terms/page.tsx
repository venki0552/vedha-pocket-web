import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export default function TermsPage() {
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
								className='transition-colors hover:text-foreground/80'
							>
								Privacy
							</Link>
							<Link href='/terms' className='text-foreground transition-colors'>
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
						Terms of Service
					</h1>
					<p className='text-muted-foreground mb-8'>
						Last updated: December 30, 2025
					</p>

					<div className='prose prose-gray dark:prose-invert max-w-none space-y-8'>
						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								1. Agreement to Terms
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								By accessing or using Memory Palace (the &quot;Service&quot;),
								operated by Vedha LLC (&quot;we,&quot; &quot;our,&quot; or
								&quot;us&quot;), you agree to be bound by these Terms of
								Service. If you do not agree to these terms, do not use the
								Service.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								2. Description of Service
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								Memory Palace is a personal knowledge management application
								that enables you to:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2 mt-4'>
								<li>Create, store, and organize personal notes and memories</li>
								<li>Upload and process documents for knowledge extraction</li>
								<li>
									Use AI-powered search and chat to interact with your stored
									knowledge
								</li>
								<li>Share selected content with other users (optional)</li>
								<li>Collaborate in teams through organizations (optional)</li>
							</ul>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								3. Account Registration
							</h2>
							<h3 className='text-lg font-medium mt-6 mb-3'>
								3.1 Account Creation
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								To use the Service, you must create an account using a valid
								email address or OAuth provider (Google, GitHub). You must
								provide accurate information and keep it updated.
							</p>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								3.2 Account Security
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								You are responsible for maintaining the security of your account
								credentials. You must immediately notify us of any unauthorized
								access to your account. We are not liable for any loss resulting
								from unauthorized use of your account.
							</p>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								3.3 Age Requirement
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								You must be at least 13 years old to use the Service. By using
								the Service, you represent that you meet this requirement.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>4. User Content</h2>
							<h3 className='text-lg font-medium mt-6 mb-3'>
								4.1 Your Content
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								You retain all ownership rights to content you create, upload,
								or store in the Service (&quot;User Content&quot;). We do not
								claim any intellectual property rights over your User Content.
							</p>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								4.2 License to Us
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								You grant us a limited, non-exclusive license to store, process,
								and display your User Content solely for the purpose of
								providing the Service. This includes generating embeddings for
								search functionality and sending content to AI providers for
								chat features.
							</p>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								4.3 Content Restrictions
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								You agree not to upload, store, or share content that:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2 mt-4'>
								<li>Violates any applicable law or regulation</li>
								<li>Infringes on intellectual property rights of others</li>
								<li>Contains malware, viruses, or harmful code</li>
								<li>Is defamatory, obscene, or otherwise objectionable</li>
								<li>Promotes violence, hatred, or discrimination</li>
								<li>Invades the privacy of others</li>
								<li>Is used to harass, abuse, or harm others</li>
							</ul>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								4.4 Content Removal
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								We reserve the right to remove or disable access to User Content
								that violates these terms, without prior notice. We will notify
								you when possible and provide an opportunity to address the
								concern.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								5. API Keys and Third-Party Services
							</h2>
							<h3 className='text-lg font-medium mt-6 mb-3'>
								5.1 Bring Your Own API Key
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								The Service allows you to provide your own OpenRouter API key
								for AI features. You are responsible for:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2 mt-4'>
								<li>Compliance with OpenRouter&apos;s terms of service</li>
								<li>All charges incurred on your API key</li>
								<li>Keeping your API key secure</li>
							</ul>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								5.2 Third-Party Terms
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								When using AI features, your content is processed by third-party
								providers (OpenRouter, underlying LLM providers). You agree to
								comply with their terms of service and understand that their
								processing of your content is governed by their respective
								privacy policies.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>6. Acceptable Use</h2>
							<p className='text-muted-foreground leading-relaxed'>
								You agree not to:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2 mt-4'>
								<li>
									Attempt to gain unauthorized access to any part of the Service
								</li>
								<li>
									Use the Service to send spam or unsolicited communications
								</li>
								<li>Interfere with or disrupt the Service or servers</li>
								<li>Reverse engineer, decompile, or disassemble the Service</li>
								<li>
									Scrape, data mine, or extract data from the Service without
									permission
								</li>
								<li>
									Use automated systems (bots, crawlers) to access the Service
									excessively
								</li>
								<li>Circumvent any security measures or access controls</li>
								<li>Use the Service for any illegal purpose</li>
								<li>Resell, lease, or sublicense access to the Service</li>
							</ul>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								7. Service Availability
							</h2>
							<h3 className='text-lg font-medium mt-6 mb-3'>7.1 Uptime</h3>
							<p className='text-muted-foreground leading-relaxed'>
								We strive to maintain high availability but do not guarantee
								uninterrupted access. The Service may be temporarily unavailable
								due to maintenance, updates, or circumstances beyond our
								control.
							</p>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								7.2 Modifications
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								We reserve the right to modify, suspend, or discontinue any part
								of the Service at any time. For significant changes, we will
								provide reasonable notice when possible.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								8. Intellectual Property
							</h2>
							<h3 className='text-lg font-medium mt-6 mb-3'>8.1 Our Rights</h3>
							<p className='text-muted-foreground leading-relaxed'>
								The Service, including its design, code, features, and branding
								(excluding User Content), is owned by Vedha LLC and protected by
								intellectual property laws. You may not copy, modify, or create
								derivative works without our permission.
							</p>

							<h3 className='text-lg font-medium mt-6 mb-3'>8.2 Feedback</h3>
							<p className='text-muted-foreground leading-relaxed'>
								If you provide suggestions, ideas, or feedback about the
								Service, you grant us the right to use them without restriction
								or compensation.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>9. Privacy</h2>
							<p className='text-muted-foreground leading-relaxed'>
								Your use of the Service is also governed by our{" "}
								<Link href='/privacy' className='text-primary hover:underline'>
									Privacy Policy
								</Link>
								, which describes how we collect, use, and protect your data.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>10. Disclaimers</h2>
							<p className='text-muted-foreground leading-relaxed'>
								THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
								AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
								IMPLIED, INCLUDING BUT NOT LIMITED TO:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2 mt-4'>
								<li>MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE</li>
								<li>NON-INFRINGEMENT</li>
								<li>
									ACCURACY, RELIABILITY, OR COMPLETENESS OF AI-GENERATED CONTENT
								</li>
								<li>UNINTERRUPTED OR ERROR-FREE OPERATION</li>
								<li>
									DATA SECURITY (THOUGH WE IMPLEMENT INDUSTRY-STANDARD MEASURES)
								</li>
							</ul>
							<p className='text-muted-foreground leading-relaxed mt-4'>
								AI-generated responses may contain errors, inaccuracies, or
								inappropriate content. You should verify important information
								independently.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								11. Limitation of Liability
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								TO THE MAXIMUM EXTENT PERMITTED BY LAW, VEDHA LLC AND ITS
								OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE
								FOR:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2 mt-4'>
								<li>
									INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
									DAMAGES
								</li>
								<li>LOSS OF PROFITS, DATA, USE, OR GOODWILL</li>
								<li>SERVICE INTERRUPTION OR DATA LOSS</li>
								<li>
									ACTIONS OF THIRD-PARTY PROVIDERS (INCLUDING AI PROVIDERS)
								</li>
							</ul>
							<p className='text-muted-foreground leading-relaxed mt-4'>
								Our total liability for any claims shall not exceed the amount
								you paid us in the 12 months preceding the claim, or $100,
								whichever is greater.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								12. Indemnification
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								You agree to indemnify and hold harmless Vedha LLC from any
								claims, damages, losses, or expenses (including reasonable legal
								fees) arising from:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2 mt-4'>
								<li>Your use of the Service</li>
								<li>Your User Content</li>
								<li>Your violation of these Terms</li>
								<li>Your violation of any third-party rights</li>
							</ul>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								13. Account Termination
							</h2>
							<h3 className='text-lg font-medium mt-6 mb-3'>
								13.1 Termination by You
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								You may delete your account at any time by contacting us or
								using account settings. Upon deletion, your data will be removed
								within 30 days.
							</p>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								13.2 Termination by Us
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								We may suspend or terminate your account if you violate these
								Terms or for any other reason with reasonable notice. In case of
								serious violations, termination may be immediate.
							</p>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								13.3 Effect of Termination
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								Upon termination, your right to use the Service ends
								immediately. Provisions of these Terms that should survive
								termination will remain in effect.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								14. Dispute Resolution
							</h2>
							<h3 className='text-lg font-medium mt-6 mb-3'>
								14.1 Informal Resolution
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								Before filing a formal dispute, you agree to contact us and
								attempt to resolve the issue informally for at least 30 days.
							</p>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								14.2 Governing Law
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								These Terms are governed by the laws of the State of Delaware,
								USA, without regard to conflict of law principles.
							</p>

							<h3 className='text-lg font-medium mt-6 mb-3'>
								14.3 Jurisdiction
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								Any legal proceedings shall be brought exclusively in the state
								or federal courts located in Delaware, and you consent to
								personal jurisdiction in those courts.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>
								15. Changes to Terms
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								We may update these Terms from time to time. Significant changes
								will be communicated via email or through the Service. Your
								continued use after changes take effect constitutes acceptance
								of the new Terms.
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>16. Miscellaneous</h2>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2'>
								<li>
									<strong>Entire Agreement:</strong> These Terms constitute the
									complete agreement between you and Vedha LLC regarding the
									Service.
								</li>
								<li>
									<strong>Severability:</strong> If any provision is found
									unenforceable, the remaining provisions remain in effect.
								</li>
								<li>
									<strong>Waiver:</strong> Our failure to enforce any provision
									does not waive our right to enforce it later.
								</li>
								<li>
									<strong>Assignment:</strong> You may not assign your rights
									under these Terms. We may assign our rights to a successor
									entity.
								</li>
							</ul>
						</section>

						<section>
							<h2 className='text-2xl font-semibold mb-4'>17. Contact</h2>
							<p className='text-muted-foreground leading-relaxed'>
								For questions about these Terms of Service:
							</p>
							<ul className='list-disc pl-6 text-muted-foreground space-y-2 mt-4'>
								<li>Email: legal@vedha.llc</li>
								<li>General inquiries: support@vedha.llc</li>
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
						<Link href='/privacy' className='hover:underline'>
							Privacy
						</Link>
						<Link href='/terms' className='hover:underline font-medium'>
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
