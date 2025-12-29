"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Markdown } from "@/components/ui/markdown";
import {
	ArrowLeft,
	Plus,
	Link2,
	Upload,
	FileText,
	Globe,
	Send,
	MessageSquare,
	Trash2,
	ExternalLink,
	Loader2,
	RefreshCw,
	Settings,
	ChevronDown,
	ChevronRight,
	Brain,
	Search,
	BookOpen,
} from "lucide-react";

interface Source {
	id: string;
	type: "pdf" | "txt" | "docx" | "url";
	title: string;
	url: string | null;
	storage_path: string | null;
	size_bytes: number;
	status:
		| "queued"
		| "extracting"
		| "chunking"
		| "embedding"
		| "ready"
		| "failed";
	error_message: string | null;
	created_at: string;
	updated_at: string;
}

interface Conversation {
	id: string;
	title: string | null;
	created_at: string;
	updated_at: string;
}

interface Pocket {
	id: string;
	name: string;
	description: string | null;
	org_id: string;
}

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	citations: { sourceId: string; title: string; chunk: string }[];
	created_at: string;
	// Streaming state
	isStreaming?: boolean;
	status?: string;
	queries?: string[];
	sources?: { source_id: string; title: string }[];
	thinking?: string;
}

interface PocketViewProps {
	pocket: Pocket;
	sources: Source[];
	conversations: Conversation[];
	canEdit: boolean;
	userId: string;
}

export function PocketView({
	pocket,
	sources: initialSources,
	conversations: initialConversations,
	canEdit,
	userId,
}: PocketViewProps) {
	const router = useRouter();
	const [sources, setSources] = useState(initialSources);
	const [activeTab, setActiveTab] = useState("chat");
	const [urlDialogOpen, setUrlDialogOpen] = useState(false);
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [newUrl, setNewUrl] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [isLoadingMessages, setIsLoadingMessages] = useState(false);
	const [conversationId, setConversationId] = useState<string | null>(
		initialConversations.length > 0 ? initialConversations[0].id : null
	);
	const [showThinking, setShowThinking] = useState<Record<string, boolean>>({});
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Fetch stats
	const { data: stats } = useQuery({
		queryKey: ["stats", pocket.id],
		queryFn: () => api.getStats(pocket.id),
		refetchInterval: 30000, // Refresh every 30s
	});

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Load messages when conversation is selected or on initial load
	useEffect(() => {
		const loadMessages = async () => {
			if (!conversationId) {
				setMessages([]);
				return;
			}

			setIsLoadingMessages(true);
			try {
				const response = await api.getMessages(conversationId);
				const loadedMessages: Message[] = (response.data || []).map(
					(m: any) => ({
						id: m.id,
						role: m.role,
						content: m.content,
						citations: m.citations || [],
						created_at: m.created_at,
					})
				);
				setMessages(loadedMessages);
			} catch (error) {
				console.error("Failed to load messages:", error);
			} finally {
				setIsLoadingMessages(false);
			}
		};

		loadMessages();
	}, [conversationId]);

	// Add URL mutation
	const addUrlMutation = useMutation({
		mutationFn: (url: string) => api.saveUrl(pocket.id, url),
		onSuccess: (data) => {
			toast({ title: "URL added", description: "Processing in background..." });
			setSources([data.data, ...sources]);
			setUrlDialogOpen(false);
			setNewUrl("");
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to add URL",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	// Upload file mutation
	const uploadFileMutation = useMutation({
		mutationFn: (file: File) => api.uploadFile(pocket.id, file),
		onSuccess: (data) => {
			toast({
				title: "File uploaded",
				description: "Processing in background...",
			});
			setSources([data.data, ...sources]);
			setUploadDialogOpen(false);
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to upload file",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	// Delete source mutation
	const deleteSourceMutation = useMutation({
		mutationFn: (sourceId: string) => api.deleteSource(sourceId),
		onSuccess: (_, sourceId) => {
			toast({ title: "Source deleted" });
			setSources(sources.filter((s) => s.id !== sourceId));
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to delete source",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const handleAddUrl = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newUrl.trim()) return;
		addUrlMutation.mutate(newUrl.trim());
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		uploadFileMutation.mutate(file);
	};

	const handleSendMessage = async () => {
		if (!inputMessage.trim() || isStreaming) return;

		const userMessage: Message = {
			id: `temp-${Date.now()}`,
			role: "user",
			content: inputMessage.trim(),
			citations: [],
			created_at: new Date().toISOString(),
		};

		const assistantMessageId = `assistant-${Date.now()}`;
		const assistantMessage: Message = {
			id: assistantMessageId,
			role: "assistant",
			content: "",
			citations: [],
			created_at: new Date().toISOString(),
			isStreaming: true,
			status: "Starting...",
		};

		setMessages((prev) => [...prev, userMessage, assistantMessage]);
		setInputMessage("");
		setIsStreaming(true);

		try {
			const result = await api.askStream(
				pocket.id,
				inputMessage.trim(),
				conversationId ?? undefined,
				(event) => {
					setMessages((prev) =>
						prev.map((msg) => {
							if (msg.id !== assistantMessageId) return msg;

							switch (event.type) {
								case "status":
									return { ...msg, status: event.payload };
								case "queries":
									return {
										...msg,
										queries: event.payload,
										status: `Searching ${event.payload.length} queries...`,
									};
								case "sources":
									return {
										...msg,
										sources: event.payload,
										status: `Found ${event.payload.length} sources`,
									};
								case "thinking":
									return {
										...msg,
										thinking: (msg.thinking || "") + event.payload,
									};
								case "token":
									return {
										...msg,
										content: msg.content + event.payload,
										status: undefined,
									};
								case "done":
									return {
										...msg,
										content: event.payload.answer,
										citations: event.payload.citations || [],
										isStreaming: false,
										status: undefined,
									};
								case "error":
									return {
										...msg,
										content: `Error: ${event.payload}`,
										isStreaming: false,
										status: undefined,
									};
								default:
									return msg;
							}
						})
					);
					scrollToBottom();
				}
			);

			if (!conversationId && result.conversation_id) {
				setConversationId(result.conversation_id);
			}
		} catch (error) {
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === assistantMessageId
						? {
								...msg,
								content:
									error instanceof Error ? error.message : "Unknown error",
								isStreaming: false,
								status: undefined,
						  }
						: msg
				)
			);
			toast({
				title: "Failed to get response",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		} finally {
			setIsStreaming(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const getStatusBadge = (status: Source["status"]) => {
		switch (status) {
			case "ready":
				return <Badge variant='default'>Ready</Badge>;
			case "extracting":
			case "chunking":
			case "embedding":
				return <Badge variant='secondary'>Processing</Badge>;
			case "queued":
				return <Badge variant='outline'>Pending</Badge>;
			case "failed":
				return <Badge variant='destructive'>Failed</Badge>;
		}
	};

	const formatFileSize = (bytes: number | null) => {
		if (!bytes) return "";
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	return (
		<div className='flex h-[calc(100vh-8rem)] flex-col'>
			{/* Header */}
			<div className='flex items-center justify-between pb-4'>
				<div className='flex items-center gap-4'>
					<Link href='/app'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-5 w-5' />
						</Button>
					</Link>
					<div>
						<h1 className='text-2xl font-bold'>{pocket.name}</h1>
						<div className='flex items-center gap-3'>
							{pocket.description && (
								<p className='text-sm text-muted-foreground'>
									{pocket.description}
								</p>
							)}
							{stats?.data && (
								<span className='text-xs text-muted-foreground'>
									{stats.data.documents} docs • {stats.data.chunks} chunks
								</span>
							)}
						</div>
					</div>
				</div>
				{canEdit && (
					<div className='flex gap-2'>
						<Dialog open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
							<DialogTrigger asChild>
								<Button variant='outline' size='sm' className='gap-2'>
									<Link2 className='h-4 w-4' />
									Add URL
								</Button>
							</DialogTrigger>
							<DialogContent>
								<form onSubmit={handleAddUrl}>
									<DialogHeader>
										<DialogTitle>Add URL</DialogTitle>
										<DialogDescription>
											Enter a URL to save and index. We'll extract the content
											automatically.
										</DialogDescription>
									</DialogHeader>
									<div className='py-4'>
										<Label htmlFor='url'>URL</Label>
										<Input
											id='url'
											type='url'
											placeholder='https://example.com/article'
											value={newUrl}
											onChange={(e) => setNewUrl(e.target.value)}
											required
										/>
									</div>
									<DialogFooter>
										<Button
											type='button'
											variant='outline'
											onClick={() => setUrlDialogOpen(false)}
										>
											Cancel
										</Button>
										<Button type='submit' disabled={addUrlMutation.isPending}>
											{addUrlMutation.isPending && (
												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
											)}
											Add URL
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>

						<Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
							<DialogTrigger asChild>
								<Button size='sm' className='gap-2'>
									<Upload className='h-4 w-4' />
									Upload File
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Upload File</DialogTitle>
									<DialogDescription>
										Upload a PDF, DOCX, or TXT file (max 10MB).
									</DialogDescription>
								</DialogHeader>
								<div className='py-4'>
									<input
										ref={fileInputRef}
										type='file'
										accept='.pdf,.doc,.docx,.txt'
										onChange={handleFileUpload}
										className='hidden'
									/>
									<Button
										variant='outline'
										className='w-full'
										onClick={() => fileInputRef.current?.click()}
										disabled={uploadFileMutation.isPending}
									>
										{uploadFileMutation.isPending ? (
											<>
												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
												Uploading...
											</>
										) : (
											<>
												<Upload className='mr-2 h-4 w-4' />
												Select File
											</>
										)}
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				)}
			</div>

			<Separator />

			{/* Main Content */}
			<div className='flex flex-1 gap-4 overflow-hidden pt-4'>
				{/* Chat Section */}
				<div className='flex flex-1 flex-col'>
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className='flex flex-1 flex-col'
					>
						<div className='flex items-center justify-between'>
							<TabsList className='grid w-64 grid-cols-2'>
								<TabsTrigger value='chat' className='gap-2'>
									<MessageSquare className='h-4 w-4' />
									Chat
								</TabsTrigger>
								<TabsTrigger value='sources' className='gap-2'>
									<FileText className='h-4 w-4' />
									Sources ({sources.length})
								</TabsTrigger>
							</TabsList>
							{activeTab === "chat" && conversationId && (
								<Button
									variant='ghost'
									size='sm'
									onClick={() => {
										setConversationId(null);
										setMessages([]);
									}}
									className='gap-2'
								>
									<Plus className='h-4 w-4' />
									New Chat
								</Button>
							)}
						</div>

						<TabsContent
							value='chat'
							className='flex-1 flex flex-col min-h-0 mt-2 data-[state=inactive]:hidden'
						>
							{/* Messages - scrollable container */}
							<div
								className='flex-1 h-0 overflow-y-auto pr-4'
								style={{ maxHeight: "calc(100vh - 300px)" }}
							>
								<div className='space-y-4 py-4'>
									{isLoadingMessages ? (
										<div className='flex items-center justify-center py-12'>
											<Spinner size='lg' />
										</div>
									) : messages.length === 0 ? (
										<div className='flex flex-col items-center justify-center py-12 text-center'>
											<MessageSquare className='h-12 w-12 text-muted-foreground' />
											<h3 className='mt-4 text-lg font-semibold'>
												Start a conversation
											</h3>
											<p className='mt-2 text-sm text-muted-foreground'>
												Ask questions about your sources. Answers will include
												citations.
											</p>
										</div>
									) : (
										messages.map((message) => (
											<div
												key={message.id}
												className={cn(
													"flex gap-3",
													message.role === "user"
														? "justify-end"
														: "justify-start"
												)}
											>
												<div
													className={cn(
														"max-w-[80%] rounded-lg px-4 py-2",
														message.role === "user"
															? "bg-primary text-primary-foreground"
															: "bg-muted"
													)}
												>
													{/* Status indicator */}
													{message.status && (
														<div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
															<Loader2 className='h-3 w-3 animate-spin' />
															{message.status}
														</div>
													)}

													{/* Thinking section (collapsible) */}
													{message.thinking && (
														<Collapsible
															open={showThinking[message.id]}
															onOpenChange={(open: boolean) =>
																setShowThinking((prev) => ({
																	...prev,
																	[message.id]: open,
																}))
															}
															className='mb-2'
														>
															<CollapsibleTrigger className='flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground'>
																<Brain className='h-3 w-3' />
																Thinking
																{showThinking[message.id] ? (
																	<ChevronDown className='h-3 w-3' />
																) : (
																	<ChevronRight className='h-3 w-3' />
																)}
															</CollapsibleTrigger>
															<CollapsibleContent className='mt-1 text-xs text-muted-foreground bg-background/50 rounded p-2 max-h-32 overflow-auto'>
																{message.thinking}
															</CollapsibleContent>
														</Collapsible>
													)}

													{/* Queries used (collapsible) */}
													{message.queries && message.queries.length > 0 && (
														<Collapsible className='mb-2'>
															<CollapsibleTrigger className='flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground'>
																<Search className='h-3 w-3' />
																{message.queries.length} search queries
																<ChevronRight className='h-3 w-3' />
															</CollapsibleTrigger>
															<CollapsibleContent className='mt-1 text-xs text-muted-foreground bg-background/50 rounded p-2'>
																<ul className='list-disc list-inside'>
																	{message.queries.map((q, i) => (
																		<li key={i}>{q}</li>
																	))}
																</ul>
															</CollapsibleContent>
														</Collapsible>
													)}

													{/* Sources used (collapsible) */}
													{message.sources && message.sources.length > 0 && (
														<Collapsible className='mb-2'>
															<CollapsibleTrigger className='flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground'>
																<BookOpen className='h-3 w-3' />
																{message.sources.length} sources
																<ChevronRight className='h-3 w-3' />
															</CollapsibleTrigger>
															<CollapsibleContent className='mt-1 text-xs text-muted-foreground bg-background/50 rounded p-2'>
																<ul className='list-disc list-inside'>
																	{message.sources.map((s, i) => (
																		<li key={i}>{s.title || "Untitled"}</li>
																	))}
																</ul>
															</CollapsibleContent>
														</Collapsible>
													)}

													{/* Main content */}
													<div className='prose-container'>
														{message.content ? (
															<Markdown content={message.content} />
														) : message.isStreaming ? (
															<span className='inline-block w-2 h-4 bg-current animate-pulse' />
														) : null}
													</div>

													{/* Citations - deduplicated by source */}
													{message.citations &&
														message.citations.length > 0 && (
															<div className='mt-2 space-y-1 border-t pt-2'>
																<p className='text-xs font-medium'>Sources:</p>
																{Array.from(
																	new Map(
																		message.citations.map((c) => [c.sourceId || c.title, c])
																	).values()
																).map((citation, i) => (
																	<p key={i} className='text-xs opacity-80'>
																		[{i + 1}] {citation.title}
																	</p>
																))}
															</div>
														)}
												</div>
											</div>
										))
									)}
									{isStreaming && (
										<div className='flex justify-start'>
											{/* Streaming is now shown in the message itself */}
										</div>
									)}
									<div ref={messagesEndRef} />
								</div>
							</div>

							{/* Input */}
							<div className='flex gap-2 pt-4'>
								<Textarea
									placeholder='Ask a question about your sources...'
									value={inputMessage}
									onChange={(e) => setInputMessage(e.target.value)}
									onKeyDown={handleKeyPress}
									className='min-h-[44px] resize-none'
									rows={1}
									disabled={
										isStreaming ||
										sources.filter((s) => s.status === "ready").length === 0
									}
								/>
								<Button
									onClick={handleSendMessage}
									disabled={
										!inputMessage.trim() ||
										isStreaming ||
										sources.filter((s) => s.status === "ready").length === 0
									}
								>
									<Send className='h-4 w-4' />
								</Button>
							</div>
							{sources.filter((s) => s.status === "ready").length === 0 && (
								<p className='mt-2 text-xs text-muted-foreground'>
									Add and process some sources before asking questions.
								</p>
							)}
						</TabsContent>

						<TabsContent value='sources' className='flex-1 overflow-auto'>
							<div className='space-y-2 py-4'>
								{sources.length === 0 ? (
									<Card className='border-dashed'>
										<CardContent className='flex flex-col items-center justify-center py-12'>
											<FileText className='h-12 w-12 text-muted-foreground' />
											<h3 className='mt-4 text-lg font-semibold'>
												No sources yet
											</h3>
											<p className='mt-2 text-center text-sm text-muted-foreground'>
												Add URLs or upload files to build your knowledge base.
											</p>
										</CardContent>
									</Card>
								) : (
									sources.map((source) => (
										<Card key={source.id}>
											<CardContent className='flex items-center justify-between p-4'>
												<div className='flex items-center gap-3'>
													{source.type === "url" ? (
														<Globe className='h-5 w-5 text-blue-500' />
													) : (
														<FileText className='h-5 w-5 text-orange-500' />
													)}
													<div>
														<p className='font-medium'>
															{source.title || source.url}
														</p>
														<div className='flex items-center gap-2 text-sm text-muted-foreground'>
															{source.type === "url" && source.url && (
																<a
																	href={source.url}
																	target='_blank'
																	rel='noopener noreferrer'
																	className='flex items-center gap-1 hover:text-primary'
																>
																	<ExternalLink className='h-3 w-3' />
																	Open
																</a>
															)}
															{source.type !== "url" &&
																source.size_bytes > 0 && (
																	<span>
																		{formatFileSize(source.size_bytes)}
																	</span>
																)}
														</div>
														{source.status === "failed" &&
															source.error_message && (
																<p className='text-xs text-destructive'>
																	{source.error_message}
																</p>
															)}
													</div>
												</div>
												<div className='flex items-center gap-2'>
													{getStatusBadge(source.status)}
													{canEdit && (
														<Button
															variant='ghost'
															size='icon'
															onClick={() =>
																deleteSourceMutation.mutate(source.id)
															}
															disabled={deleteSourceMutation.isPending}
														>
															<Trash2 className='h-4 w-4 text-destructive' />
														</Button>
													)}
												</div>
											</CardContent>
										</Card>
									))
								)}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
