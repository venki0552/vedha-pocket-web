"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	FolderOpen,
	FileText,
	Layers,
	MessageSquare,
	MessagesSquare,
} from "lucide-react";

interface Stats {
	pockets: number;
	sources: number;
	chunks: number;
	conversations: number;
	messages: number;
}

interface AnalyticsDashboardProps {
	stats: Stats;
}

export function AnalyticsDashboard({ stats }: AnalyticsDashboardProps) {
	const cards = [
		{
			title: "Pockets",
			value: stats.pockets,
			description: "Knowledge containers",
			icon: FolderOpen,
			color: "text-blue-500",
		},
		{
			title: "Sources",
			value: stats.sources,
			description: "URLs and files",
			icon: FileText,
			color: "text-green-500",
		},
		{
			title: "Chunks",
			value: stats.chunks,
			description: "Indexed content pieces",
			icon: Layers,
			color: "text-purple-500",
		},
		{
			title: "Conversations",
			value: stats.conversations,
			description: "Chat sessions",
			icon: MessageSquare,
			color: "text-orange-500",
		},
		{
			title: "Messages",
			value: stats.messages,
			description: "Questions and answers",
			icon: MessagesSquare,
			color: "text-pink-500",
		},
	];

	return (
		<div className='space-y-6'>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
				{cards.map((card) => (
					<Card key={card.title}>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								{card.title}
							</CardTitle>
							<card.icon className={`h-4 w-4 ${card.color}`} />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{card.value.toLocaleString()}
							</div>
							<p className='text-xs text-muted-foreground'>
								{card.description}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Usage Tips</CardTitle>
					<CardDescription>Get the most out of Vedha Pocket</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='space-y-2'>
						<h4 className='font-medium'>📚 Organize with Pockets</h4>
						<p className='text-sm text-muted-foreground'>
							Create separate pockets for different projects or topics. This
							helps keep your knowledge organized and improves search relevance.
						</p>
					</div>
					<div className='space-y-2'>
						<h4 className='font-medium'>🔗 Add Quality Sources</h4>
						<p className='text-sm text-muted-foreground'>
							The quality of your answers depends on your sources. Add
							authoritative articles, documentation, and well-structured
							documents.
						</p>
					</div>
					<div className='space-y-2'>
						<h4 className='font-medium'>💬 Ask Specific Questions</h4>
						<p className='text-sm text-muted-foreground'>
							Be specific in your questions. Instead of "tell me about X", ask
							"what are the key benefits of X according to [source]?"
						</p>
					</div>
					<div className='space-y-2'>
						<h4 className='font-medium'>📝 Check Citations</h4>
						<p className='text-sm text-muted-foreground'>
							Always verify answers by checking the cited sources. The AI
							provides citations to help you validate information.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
