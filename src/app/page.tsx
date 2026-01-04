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
	Sparkles,
	Search,
	Shield,
	Zap,
	ArrowRight,
	MessageSquare,
	Palette,
	Tags,
	Share2,
	FileEdit,
	Globe,
	CheckSquare,
	FolderOpen,
	Lock,
	Key,
	Github,
	Chrome,
	Download,
	ExternalLink,
} from "lucide-react";

export default function HomePage() {
	return (
		<div className='flex min-h-screen flex-col'>
			{/* Header */}
			<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='container flex h-16 items-center'>
					<div className='mr-4 flex'>
						<Link href='/' className='mr-6 flex items-center space-x-2'>
							<Brain className='h-7 w-7 text-primary' />
							<span className='font-bold text-xl'>Memory Palace</span>
						</Link>
					</div>
					<div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
						<nav className='flex items-center space-x-6 text-sm font-medium'>
							<Link
								href='#features'
								className='transition-colors hover:text-foreground/80'
							>
								Features
							</Link>
							<Link
								href='#how-it-works'
								className='transition-colors hover:text-foreground/80'
							>
								How It Works
							</Link>
							<Link
								href='/security'
								className='transition-colors hover:text-foreground/80'
							>
								Security
							</Link>
							<a
								href='https://github.com/venki0552'
								target='_blank'
								rel='noopener noreferrer'
								className='transition-colors hover:text-foreground/80 flex items-center gap-1'
							>
								<Github className='h-4 w-4' />
								GitHub
							</a>
						</nav>
						<div className='flex items-center space-x-2'>
							<Link href='/login'>
								<Button variant='ghost'>Sign In</Button>
							</Link>
							<Link href='/login?signup=true'>
								<Button>Get Started Free</Button>
							</Link>
						</div>
					</div>
				</div>
			</header>

			<main className='flex-1'>
				{/* Hero Section */}
				<section className='relative overflow-hidden'>
					<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5' />
					<div className='container relative py-20 md:py-32 lg:py-40'>
						<div className='mx-auto flex max-w-[64rem] flex-col items-center gap-6 text-center'>
							<div className='flex flex-wrap items-center justify-center gap-2'>
								<div className='flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm'>
									<Sparkles className='h-4 w-4 text-primary' />
									<span>AI-Powered Personal Knowledge Management</span>
								</div>
								<a
									href='https://github.com/venki0552'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center gap-2 rounded-full border border-green-500/50 bg-green-500/10 px-4 py-1.5 text-sm text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors'
								>
									<Github className='h-4 w-4' />
									<span>100% Open Source</span>
								</a>
							</div>
							<h1 className='font-heading text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl'>
								Your Personal
								<span className='bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'>
									{" "}
									Memory Palace
								</span>
							</h1>
							<p className='max-w-[42rem] text-lg leading-relaxed text-muted-foreground sm:text-xl'>
								Capture thoughts, ideas, and knowledge like Google Keep — then
								chat with your memories using AI. Publish, share, and never
								forget what matters.
							</p>
							<div className='flex flex-col gap-4 sm:flex-row'>
								<Link href='/login?signup=true'>
									<Button size='lg' className='gap-2 text-lg h-12 px-8'>
										Start Building Your Palace{" "}
										<ArrowRight className='h-5 w-5' />
									</Button>
								</Link>
								<Link href='#features'>
									<Button variant='outline' size='lg' className='h-12 px-8'>
										See Features
									</Button>
								</Link>
							</div>
							<p className='text-sm text-muted-foreground'>
								Free to use • Bring your own OpenRouter API key
							</p>
						</div>
					</div>
				</section>

				{/* Preview Section */}
				<section className='border-y bg-muted/30 py-16'>
					<div className='container'>
						<div className='mx-auto grid max-w-5xl gap-8 md:grid-cols-3'>
							<div className='flex flex-col items-center gap-3 text-center'>
								<div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
									<FileEdit className='h-6 w-6 text-primary' />
								</div>
								<h3 className='font-semibold'>Create Memories</h3>
								<p className='text-sm text-muted-foreground'>
									Rich text notes with markdown, checklists, colors, and tags
								</p>
							</div>
							<div className='flex flex-col items-center gap-3 text-center'>
								<div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
									<Globe className='h-6 w-6 text-primary' />
								</div>
								<h3 className='font-semibold'>Publish & Index</h3>
								<p className='text-sm text-muted-foreground'>
									Publish memories to make them searchable by AI
								</p>
							</div>
							<div className='flex flex-col items-center gap-3 text-center'>
								<div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
									<MessageSquare className='h-6 w-6 text-primary' />
								</div>
								<h3 className='font-semibold'>Chat with Knowledge</h3>
								<p className='text-sm text-muted-foreground'>
									Ask questions and get AI answers with citations
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section id='features' className='container py-20 md:py-32'>
					<div className='mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center'>
						<h2 className='font-heading text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl'>
							Everything You Need
						</h2>
						<p className='max-w-[42rem] leading-relaxed text-muted-foreground sm:text-lg'>
							A complete personal knowledge system with Google Keep-style notes
							and AI-powered retrieval.
						</p>
					</div>

					<div className='mx-auto mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl'>
						{/* Memory Features */}
						<Card className='relative overflow-hidden'>
							<div className='absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-red-100 to-transparent dark:from-red-950/30' />
							<CardHeader>
								<Palette className='h-10 w-10 text-primary' />
								<CardTitle className='mt-4'>Google Keep-Style Notes</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className='text-base'>
									12 beautiful colors, pin to top, archive, and organize
									visually. Your memories, your way.
								</CardDescription>
							</CardContent>
						</Card>

						<Card className='relative overflow-hidden'>
							<div className='absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-emerald-100 to-transparent dark:from-emerald-950/30' />
							<CardHeader>
								<CheckSquare className='h-10 w-10 text-primary' />
								<CardTitle className='mt-4'>Rich Text & Checklists</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className='text-base'>
									Tiptap-powered editor with markdown, headings, lists, and
									interactive task checklists.
								</CardDescription>
							</CardContent>
						</Card>

						<Card className='relative overflow-hidden'>
							<div className='absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-blue-100 to-transparent dark:from-blue-950/30' />
							<CardHeader>
								<Tags className='h-10 w-10 text-primary' />
								<CardTitle className='mt-4'>Tags & Filtering</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className='text-base'>
									Add tags to memories and filter instantly. No folders
									needed—just powerful organization.
								</CardDescription>
							</CardContent>
						</Card>

						<Card className='relative overflow-hidden'>
							<div className='absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-indigo-100 to-transparent dark:from-indigo-950/30' />
							<CardHeader>
								<FileEdit className='h-10 w-10 text-primary' />
								<CardTitle className='mt-4'>Draft & Publish</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className='text-base'>
									Keep drafts private. Publish when ready to make memories
									searchable in AI chat.
								</CardDescription>
							</CardContent>
						</Card>

						<Card className='relative overflow-hidden'>
							<div className='absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-pink-100 to-transparent dark:from-pink-950/30' />
							<CardHeader>
								<Share2 className='h-10 w-10 text-primary' />
								<CardTitle className='mt-4'>Share with Anyone</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className='text-base'>
									Share memories via email with view or comment permissions.
									Collaborate on knowledge.
								</CardDescription>
							</CardContent>
						</Card>

						<Card className='relative overflow-hidden'>
							<div className='absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-yellow-100 to-transparent dark:from-yellow-950/30' />
							<CardHeader>
								<MessageSquare className='h-10 w-10 text-primary' />
								<CardTitle className='mt-4'>Inline Comments</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className='text-base'>
									Add position-based comments to memories. Perfect for feedback
									and discussions.
								</CardDescription>
							</CardContent>
						</Card>
					</div>

					{/* AI Features */}
					<div className='mx-auto mt-20 max-w-6xl'>
						<div className='text-center mb-12'>
							<h3 className='text-2xl font-bold'>AI-Powered Features</h3>
							<p className='text-muted-foreground mt-2'>
								Your memories become a searchable knowledge base
							</p>
						</div>

						<div className='grid gap-6 md:grid-cols-2'>
							<Card className='border-primary/50 bg-gradient-to-br from-primary/5 to-transparent'>
								<CardHeader>
									<Search className='h-10 w-10 text-primary' />
									<CardTitle className='mt-4'>Hybrid AI Search</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-base'>
										Semantic + keyword search powered by pgvector. Find anything
										in your published memories instantly with intelligent
										ranking.
									</CardDescription>
								</CardContent>
							</Card>

							<Card className='border-primary/50 bg-gradient-to-br from-primary/5 to-transparent'>
								<CardHeader>
									<Brain className='h-10 w-10 text-primary' />
									<CardTitle className='mt-4'>General Chat</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className='text-base'>
										Ask questions across all your memories. Get streaming AI
										responses with citations back to the source memories.
									</CardDescription>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Pockets Feature */}
					<div className='mx-auto mt-20 max-w-4xl'>
						<Card className='border-2'>
							<CardHeader className='text-center'>
								<FolderOpen className='h-12 w-12 text-primary mx-auto' />
								<CardTitle className='mt-4 text-2xl'>
									Pockets: Isolated Knowledge Containers
								</CardTitle>
							</CardHeader>
							<CardContent className='text-center'>
								<CardDescription className='text-base max-w-2xl mx-auto'>
									Create separate &quot;Pockets&quot; for focused conversations.
									Upload documents and URLs, then chat with AI about just that
									content—completely separate from your memories.
								</CardDescription>
								<div className='mt-6 flex flex-wrap justify-center gap-4'>
									<div className='flex items-center gap-2 text-sm'>
										<Zap className='h-4 w-4 text-primary' />
										<span>PDF & Document Upload</span>
									</div>
									<div className='flex items-center gap-2 text-sm'>
										<Zap className='h-4 w-4 text-primary' />
										<span>URL Scraping</span>
									</div>
									<div className='flex items-center gap-2 text-sm'>
										<Zap className='h-4 w-4 text-primary' />
										<span>Isolated RAG Chat</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</section>

				{/* How It Works */}
				<section
					id='how-it-works'
					className='border-t bg-muted/30 py-20 md:py-32'
				>
					<div className='container'>
						<div className='mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center'>
							<h2 className='font-heading text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl'>
								How It Works
							</h2>
							<p className='max-w-[42rem] leading-relaxed text-muted-foreground sm:text-lg'>
								From thought to searchable knowledge in seconds
							</p>
						</div>

						<div className='mx-auto mt-16 max-w-4xl'>
							<div className='grid gap-8 md:grid-cols-4'>
								<div className='text-center'>
									<div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg'>
										1
									</div>
									<h4 className='font-semibold'>Create</h4>
									<p className='text-sm text-muted-foreground mt-1'>
										Write a memory with rich text, pick a color, add tags
									</p>
								</div>
								<div className='text-center'>
									<div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg'>
										2
									</div>
									<h4 className='font-semibold'>Publish</h4>
									<p className='text-sm text-muted-foreground mt-1'>
										Click publish to index with AI embeddings
									</p>
								</div>
								<div className='text-center'>
									<div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg'>
										3
									</div>
									<h4 className='font-semibold'>Search</h4>
									<p className='text-sm text-muted-foreground mt-1'>
										Use General Chat to ask questions
									</p>
								</div>
								<div className='text-center'>
									<div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg'>
										4
									</div>
									<h4 className='font-semibold'>Recall</h4>
									<p className='text-sm text-muted-foreground mt-1'>
										Get AI answers with citations to your memories
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Security & Privacy */}
				<section className='container py-20 md:py-32'>
					<div className='mx-auto max-w-4xl'>
						<Card className='border-2 border-green-500/30 bg-green-50/50 dark:bg-green-950/20'>
							<CardHeader className='text-center'>
								<Shield className='h-12 w-12 text-green-600 mx-auto' />
								<CardTitle className='mt-4 text-2xl'>
									Your Data, Your Control
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='grid gap-6 md:grid-cols-2'>
									<div className='flex gap-3'>
										<Lock className='h-5 w-5 text-green-600 shrink-0 mt-0.5' />
										<div>
											<h4 className='font-semibold'>Row-Level Security</h4>
											<p className='text-sm text-muted-foreground'>
												PostgreSQL RLS ensures you only see your own data
											</p>
										</div>
									</div>
									<div className='flex gap-3'>
										<Key className='h-5 w-5 text-green-600 shrink-0 mt-0.5' />
										<div>
											<h4 className='font-semibold'>BYOK</h4>
											<p className='text-sm text-muted-foreground'>
												Bring your own OpenRouter key—we never store it
											</p>
										</div>
									</div>
									<div className='flex gap-3'>
										<Shield className='h-5 w-5 text-green-600 shrink-0 mt-0.5' />
										<div>
											<h4 className='font-semibold'>End-to-End Auth</h4>
											<p className='text-sm text-muted-foreground'>
												Supabase Auth with magic links and OAuth
											</p>
										</div>
									</div>
									<div className='flex gap-3'>
										<Globe className='h-5 w-5 text-green-600 shrink-0 mt-0.5' />
										<div>
											<h4 className='font-semibold'>Open Source</h4>
											<p className='text-sm text-muted-foreground'>
												Audit the code, self-host if you prefer
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</section>

				{/* API Key Notice */}
				<section className='border-t bg-amber-50/50 dark:bg-amber-950/20 py-12'>
					<div className='container'>
						<Card className='mx-auto max-w-2xl border-amber-500/50 bg-transparent shadow-none'>
							<CardHeader className='text-center pb-2'>
								<Key className='h-8 w-8 text-amber-600 mx-auto' />
								<CardTitle className='text-lg text-amber-700 dark:text-amber-400'>
									Bring Your Own API Key
								</CardTitle>
							</CardHeader>
							<CardContent className='text-center'>
								<p className='text-sm text-muted-foreground'>
									This app uses <strong>OpenRouter</strong> for AI features.
									You&apos;ll need to add your API key in Settings after signing
									up. Get a key at{" "}
									<a
										href='https://openrouter.ai/keys'
										target='_blank'
										rel='noopener noreferrer'
										className='text-primary hover:underline'
									>
										openrouter.ai/keys
									</a>
								</p>
							</CardContent>
						</Card>
					</div>
				</section>

				{/* Chrome Extension Section */}
				<section className='border-t bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 py-16'>
					<div className='container'>
						<div className='mx-auto max-w-4xl text-center'>
							<div className='flex justify-center mb-6'>
								<div className='p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border'>
									<Chrome className='h-12 w-12 text-primary' />
								</div>
							</div>
							<h2 className='font-heading text-3xl font-bold mb-4'>
								Chrome Extension
							</h2>
							<p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto'>
								Save any webpage to your Memory Palace with one click. Chat with
								your knowledge without leaving the page you&apos;re reading.
							</p>
							<div className='flex flex-col sm:flex-row gap-4 justify-center'>
								<a
									href='https://github.com/venki0552/vedha-pocket-extension'
									target='_blank'
									rel='noopener noreferrer'
								>
									<Button size='lg' className='gap-2'>
										<Download className='h-5 w-5' />
										Download Extension
									</Button>
								</a>
								<a
									href='https://github.com/venki0552/vedha-pocket-extension#installation'
									target='_blank'
									rel='noopener noreferrer'
								>
									<Button size='lg' variant='outline' className='gap-2'>
										<ExternalLink className='h-5 w-5' />
										Installation Guide
									</Button>
								</a>
							</div>
							<div className='mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto'>
								<div className='flex items-center gap-2 justify-center text-sm text-muted-foreground'>
									<CheckSquare className='h-4 w-4 text-green-600' />
									<span>Save pages instantly</span>
								</div>
								<div className='flex items-center gap-2 justify-center text-sm text-muted-foreground'>
									<MessageSquare className='h-4 w-4 text-green-600' />
									<span>Chat with your memories</span>
								</div>
								<div className='flex items-center gap-2 justify-center text-sm text-muted-foreground'>
									<Shield className='h-4 w-4 text-green-600' />
									<span>Secure & private</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Open Source Section */}
				<section className='border-t py-16'>
					<div className='container'>
						<div className='mx-auto max-w-4xl text-center'>
							<div className='flex justify-center mb-6'>
								<div className='p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20'>
									<Github className='h-12 w-12 text-green-600' />
								</div>
							</div>
							<h2 className='font-heading text-3xl font-bold mb-4'>
								Fully Open Source
							</h2>
							<p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto'>
								Memory Palace is 100% open source. Audit the code, contribute,
								or self-host your own instance. Built with transparency in mind.
							</p>
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
								<a
									href='https://github.com/venki0552/vedha-pocket-web'
									target='_blank'
									rel='noopener noreferrer'
									className='group'
								>
									<Card className='h-full hover:border-primary/50 transition-colors'>
										<CardContent className='p-4 flex items-center gap-3'>
											<Globe className='h-5 w-5 text-primary shrink-0' />
											<div className='text-left'>
												<p className='font-medium text-sm group-hover:text-primary transition-colors'>
													Web App
												</p>
												<p className='text-xs text-muted-foreground'>
													Next.js Frontend
												</p>
											</div>
										</CardContent>
									</Card>
								</a>
								<a
									href='https://github.com/venki0552/vedha-pocket-api'
									target='_blank'
									rel='noopener noreferrer'
									className='group'
								>
									<Card className='h-full hover:border-primary/50 transition-colors'>
										<CardContent className='p-4 flex items-center gap-3'>
											<Zap className='h-5 w-5 text-primary shrink-0' />
											<div className='text-left'>
												<p className='font-medium text-sm group-hover:text-primary transition-colors'>
													API Server
												</p>
												<p className='text-xs text-muted-foreground'>
													Hono.js Backend
												</p>
											</div>
										</CardContent>
									</Card>
								</a>
								<a
									href='https://github.com/venki0552/vedha-pocket-worker'
									target='_blank'
									rel='noopener noreferrer'
									className='group'
								>
									<Card className='h-full hover:border-primary/50 transition-colors'>
										<CardContent className='p-4 flex items-center gap-3'>
											<Sparkles className='h-5 w-5 text-primary shrink-0' />
											<div className='text-left'>
												<p className='font-medium text-sm group-hover:text-primary transition-colors'>
													Worker
												</p>
												<p className='text-xs text-muted-foreground'>
													RAG Pipeline
												</p>
											</div>
										</CardContent>
									</Card>
								</a>
								<a
									href='https://github.com/venki0552/vedha-pocket-extension'
									target='_blank'
									rel='noopener noreferrer'
									className='group'
								>
									<Card className='h-full hover:border-primary/50 transition-colors'>
										<CardContent className='p-4 flex items-center gap-3'>
											<Chrome className='h-5 w-5 text-primary shrink-0' />
											<div className='text-left'>
												<p className='font-medium text-sm group-hover:text-primary transition-colors'>
													Extension
												</p>
												<p className='text-xs text-muted-foreground'>
													Chrome Browser
												</p>
											</div>
										</CardContent>
									</Card>
								</a>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className='border-t bg-gradient-to-br from-primary/5 via-background to-purple-500/5'>
					<div className='container flex flex-col items-center gap-6 py-20 text-center md:py-32'>
						<h2 className='font-heading text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl'>
							Ready to Build Your Memory Palace?
						</h2>
						<p className='max-w-[42rem] text-lg leading-relaxed text-muted-foreground'>
							Start capturing and organizing your knowledge today. Free to use
							with your own API key.
						</p>
						<Link href='/login?signup=true'>
							<Button size='lg' className='gap-2 text-lg h-12 px-8'>
								Get Started Free <ArrowRight className='h-5 w-5' />
							</Button>
						</Link>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className='border-t py-8 md:py-12'>
				<div className='container flex flex-col items-center justify-between gap-6 md:flex-row'>
					<div className='flex items-center gap-2'>
						<Brain className='h-6 w-6 text-primary' />
						<span className='font-semibold'>Memory Palace</span>
						<span className='text-sm text-muted-foreground'>by Vedha LLC</span>
					</div>
					<div className='flex items-center gap-6 text-sm text-muted-foreground'>
						<Link href='/privacy' className='hover:text-foreground'>
							Privacy
						</Link>
						<Link href='/terms' className='hover:text-foreground'>
							Terms
						</Link>
						<Link href='/security' className='hover:text-foreground'>
							Security
						</Link>
						<a
							href='https://github.com/venki0552'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-foreground flex items-center gap-1'
						>
							<Github className='h-4 w-4' />
							GitHub
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
