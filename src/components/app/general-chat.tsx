"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
	Send,
	Loader2,
	MessageSquare,
	Sparkles,
	Trash2,
	ChevronRight,
	ChevronDown,
	Plus,
	History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	citations?: Citation[];
	created_at: string;
}

interface Conversation {
	id: string;
	title: string | null;
	updated_at: string;
}

interface Citation {
	chunk_id: string;
	memory_id: string;
	title: string | null;
	color: string;
	snippet: string;
}

interface GeneralChatProps {
	orgId: string;
}

// Color mapping for citations
const colorClasses: Record<string, string> = {
	default: "border-l-gray-400",
	coral: "border-l-red-400",
	peach: "border-l-orange-400",
	sand: "border-l-yellow-400",
	mint: "border-l-emerald-400",
	sage: "border-l-green-400",
	fog: "border-l-slate-400",
	storm: "border-l-blue-400",
	dusk: "border-l-indigo-400",
	blossom: "border-l-pink-400",
	clay: "border-l-amber-400",
	chalk: "border-l-gray-400",
};

export function GeneralChat({ orgId }: GeneralChatProps) {
	const router = useRouter();
	const { toast } = useToast();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [activeConversation, setActiveConversation] = useState<string | null>(
		null
	);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isStreaming, setIsStreaming] = useState(false);
	const [streamingContent, setStreamingContent] = useState("");
	const [streamingSources, setStreamingSources] = useState<any[]>([]);
	const [showHistory, setShowHistory] = useState(false);

	// Load conversations on mount and auto-select last one
	useEffect(() => {
		const initConversations = async () => {
			try {
				const { data } = await api.listGeneralConversations(orgId);
				setConversations(data || []);
				// Auto-load the most recent conversation
				if (data && data.length > 0 && !activeConversation) {
					setActiveConversation(data[0].id);
					const { data: msgs } = await api.getGeneralConversation(data[0].id);
					setMessages(msgs || []);
				}
			} catch (error) {
				console.error("Failed to load conversations:", error);
			}
		};
		initConversations();
	}, [orgId]);

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, streamingContent]);

	const loadConversations = async () => {
		try {
			const { data } = await api.listGeneralConversations(orgId);
			setConversations(data || []);
		} catch (error) {
			console.error("Failed to load conversations:", error);
		}
	};

	const loadMessages = async (conversationId: string) => {
		try {
			const { data } = await api.getGeneralConversation(conversationId);
			setMessages(data || []);
		} catch (error) {
			console.error("Failed to load messages:", error);
		}
	};

	const handleSelectConversation = async (conversationId: string) => {
		setActiveConversation(conversationId);
		await loadMessages(conversationId);
	};

	const handleNewConversation = () => {
		setActiveConversation(null);
		setMessages([]);
		setInput("");
	};

	const handleDeleteConversation = async (conversationId: string) => {
		try {
			await api.deleteGeneralConversation(conversationId);
			toast({ title: "Conversation deleted" });
			if (activeConversation === conversationId) {
				handleNewConversation();
			}
			loadConversations();
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete conversation",
				variant: "destructive",
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const question = input.trim();
		setInput("");
		setIsLoading(true);
		setIsStreaming(true);
		setStreamingContent("");
		setStreamingSources([]);

		// Add user message to UI immediately
		const userMessage: Message = {
			id: crypto.randomUUID(),
			role: "user",
			content: question,
			created_at: new Date().toISOString(),
		};
		setMessages((prev) => [...prev, userMessage]);

		let fullContent = "";

		try {
			const result = await api.askGeneralChat(
				orgId,
				question,
				activeConversation || undefined,
				(event) => {
					switch (event.type) {
						case "sources":
							setStreamingSources(event.payload);
							break;
						case "token":
							fullContent += event.payload;
							setStreamingContent(fullContent);
							break;
						case "done":
							// Add assistant message
							const assistantMessage: Message = {
								id: crypto.randomUUID(),
								role: "assistant",
								content: fullContent,
								citations: event.payload.citations,
								created_at: new Date().toISOString(),
							};
							setMessages((prev) => [...prev, assistantMessage]);
							setStreamingContent("");
							setStreamingSources([]);

							// Update active conversation
							if (event.payload.conversation_id && !activeConversation) {
								setActiveConversation(event.payload.conversation_id);
								loadConversations();
							}
							break;
						case "error":
							toast({
								title: "Error",
								description: event.payload,
								variant: "destructive",
							});
							break;
					}
				}
			);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to send message. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
			setIsStreaming(false);
		}
	};

	return (
		<div className='flex flex-col h-[calc(100vh-16rem)]'>
			{/* Chat area */}
			<div className='flex-1 flex flex-col border rounded-lg'>
				{/* Chat header with history toggle */}
				<div className='flex items-center justify-between p-3 border-b'>
					<div className='flex items-center gap-2'>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setShowHistory(!showHistory)}
							className='gap-1'
						>
							<History className='h-4 w-4' />
							History
							<ChevronDown
								className={cn(
									"h-4 w-4 transition-transform",
									showHistory && "rotate-180"
								)}
							/>
						</Button>
						{activeConversation && (
							<span className='text-sm text-muted-foreground'>
								{conversations.find((c) => c.id === activeConversation)
									?.title || "Current chat"}
							</span>
						)}
					</div>
					<Button variant='outline' size='sm' onClick={handleNewConversation}>
						<Plus className='h-4 w-4 mr-1' />
						New Chat
					</Button>
				</div>

				{/* Collapsible history panel */}
				{showHistory && (
					<div className='border-b max-h-48 overflow-y-auto bg-muted/30'>
						<div className='p-2 space-y-1'>
							{conversations.length === 0 ? (
								<p className='text-sm text-muted-foreground text-center py-4'>
									No conversations yet
								</p>
							) : (
								conversations.map((conv) => (
									<div
										key={conv.id}
										className={cn(
											"group flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-accent",
											activeConversation === conv.id && "bg-accent"
										)}
										onClick={() => {
											handleSelectConversation(conv.id);
											setShowHistory(false);
										}}
									>
										<div className='min-w-0 flex-1'>
											<p className='text-sm font-medium truncate'>
												{conv.title || "New conversation"}
											</p>
											<p className='text-xs text-muted-foreground'>
												{formatDistanceToNow(new Date(conv.updated_at), {
													addSuffix: true,
												})}
											</p>
										</div>
										<Button
											variant='ghost'
											size='icon'
											className='h-8 w-8 opacity-0 group-hover:opacity-100'
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteConversation(conv.id);
											}}
										>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								))
							)}
						</div>
					</div>
				)}
				{/* Messages */}
				<ScrollArea className='flex-1 p-4'>
					{messages.length === 0 && !isStreaming ? (
						<div className='h-full flex items-center justify-center'>
							<div className='text-center max-w-md'>
								<Sparkles className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
								<h3 className='text-lg font-medium'>Search Your Memories</h3>
								<p className='text-sm text-muted-foreground mt-2'>
									Ask questions about your published memories. I&apos;ll search
									through them and provide relevant answers with citations.
								</p>
							</div>
						</div>
					) : (
						<div className='space-y-4'>
							{messages.map((message) => (
								<div
									key={message.id}
									className={cn(
										"flex",
										message.role === "user" ? "justify-end" : "justify-start"
									)}
								>
									<div
										className={cn(
											"max-w-[80%] rounded-lg p-3",
											message.role === "user"
												? "bg-primary text-primary-foreground"
												: "bg-muted"
										)}
									>
										<p className='text-sm whitespace-pre-wrap'>
											{message.content}
										</p>

										{/* Citations */}
										{message.citations && message.citations.length > 0 && (
											<div className='mt-3 space-y-2'>
												<p className='text-xs font-medium opacity-75'>
													Sources:
												</p>
												{message.citations.map((citation, i) => (
													<div
														key={i}
														className={cn(
															"text-xs p-2 rounded border-l-4 bg-background/50",
															colorClasses[citation.color] ||
																colorClasses.default
														)}
													>
														<p className='font-medium'>
															{citation.title || "Untitled"}
														</p>
														<p className='text-muted-foreground line-clamp-2'>
															{citation.snippet}
														</p>
													</div>
												))}
											</div>
										)}
									</div>
								</div>
							))}

							{/* Streaming message */}
							{isStreaming && (
								<div className='flex justify-start'>
									<div className='max-w-[80%] rounded-lg p-3 bg-muted'>
										{streamingSources.length > 0 && (
											<div className='mb-3 flex flex-wrap gap-2'>
												{streamingSources.map((source, i) => (
													<Badge
														key={i}
														variant='secondary'
														className='text-xs'
													>
														{source.title || "Memory " + (i + 1)}
													</Badge>
												))}
											</div>
										)}
										<p className='text-sm whitespace-pre-wrap'>
											{streamingContent}
											{!streamingContent && (
												<Loader2 className='h-4 w-4 animate-spin' />
											)}
										</p>
									</div>
								</div>
							)}

							<div ref={messagesEndRef} />
						</div>
					)}
				</ScrollArea>

				{/* Input */}
				<div className='p-4 border-t'>
					<form onSubmit={handleSubmit} className='flex gap-2'>
						<Textarea
							placeholder='Ask about your memories...'
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleSubmit(e);
								}
							}}
							className='min-h-[50px] resize-none'
							disabled={isLoading}
						/>
						<Button
							type='submit'
							size='icon'
							className='h-[50px] w-[50px]'
							disabled={isLoading || !input.trim()}
						>
							{isLoading ? (
								<Loader2 className='h-5 w-5 animate-spin' />
							) : (
								<Send className='h-5 w-5' />
							)}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
