"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Grid3X3, List, MessageSquare, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemoryGrid } from "@/components/app/memory-grid";
import { GeneralChat } from "@/components/app/general-chat";
import { MemoryEditorDialog } from "@/components/app/memory-editor-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Memory {
	id: string;
	org_id: string;
	user_id: string;
	title: string | null;
	content: string;
	content_html: string;
	color: string;
	tags: string[];
	status: "draft" | "published";
	is_pinned: boolean;
	is_archived: boolean;
	created_at: string;
	updated_at: string;
	published_at: string | null;
}

interface MemoriesViewProps {
	memories: Memory[];
	tags: string[];
	orgId: string;
}

export function MemoriesView({ memories, tags, orgId }: MemoriesViewProps) {
	const router = useRouter();
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [editorOpen, setEditorOpen] = useState(false);
	const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

	// Filter memories
	const filteredMemories = memories.filter((memory) => {
		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			const matchesTitle = memory.title?.toLowerCase().includes(query);
			const matchesContent = memory.content.toLowerCase().includes(query);
			if (!matchesTitle && !matchesContent) return false;
		}

		// Tag filter
		if (selectedTags.length > 0) {
			const hasTags = selectedTags.some((tag) => memory.tags.includes(tag));
			if (!hasTags) return false;
		}

		return true;
	});

	const handleCreateNew = () => {
		setEditingMemory(null);
		setEditorOpen(true);
	};

	const handleEditMemory = (memory: Memory) => {
		setEditingMemory(memory);
		setEditorOpen(true);
	};

	const handleCloseEditor = () => {
		setEditorOpen(false);
		setEditingMemory(null);
		router.refresh();
	};

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
		);
	};

	return (
		<div className='space-y-6'>
			<Tabs defaultValue='memories' className='w-full'>
				<div className='flex items-center justify-between gap-4 flex-wrap'>
					<TabsList>
						<TabsTrigger value='memories' className='gap-2'>
							<Grid3X3 className='h-4 w-4' />
							My Memories
						</TabsTrigger>
						<TabsTrigger value='chat' className='gap-2'>
							<MessageSquare className='h-4 w-4' />
							General Chat
						</TabsTrigger>
					</TabsList>

					<div className='flex items-center gap-2'>
						<Button onClick={handleCreateNew} size='sm'>
							<Plus className='h-4 w-4 mr-2' />
							New Memory
						</Button>
					</div>
				</div>

				<TabsContent value='memories' className='mt-6'>
					{/* Search and filters */}
					<div className='flex flex-col gap-4 mb-6'>
						<div className='flex items-center gap-4'>
							<div className='relative flex-1 max-w-md'>
								<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
								<Input
									placeholder='Search memories...'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className='pl-9'
								/>
							</div>
							<div className='flex items-center gap-2'>
								<Button
									variant={viewMode === "grid" ? "secondary" : "ghost"}
									size='icon'
									onClick={() => setViewMode("grid")}
								>
									<Grid3X3 className='h-4 w-4' />
								</Button>
								<Button
									variant={viewMode === "list" ? "secondary" : "ghost"}
									size='icon'
									onClick={() => setViewMode("list")}
								>
									<List className='h-4 w-4' />
								</Button>
							</div>
						</div>

						{/* Tags filter */}
						{tags.length > 0 && (
							<div className='flex items-center gap-2 flex-wrap'>
								<Tag className='h-4 w-4 text-muted-foreground' />
								{tags.map((tag) => (
									<Badge
										key={tag}
										variant={selectedTags.includes(tag) ? "default" : "outline"}
										className='cursor-pointer'
										onClick={() => toggleTag(tag)}
									>
										{tag}
									</Badge>
								))}
								{selectedTags.length > 0 && (
									<Button
										variant='ghost'
										size='sm'
										onClick={() => setSelectedTags([])}
									>
										Clear
									</Button>
								)}
							</div>
						)}
					</div>

					{filteredMemories.length === 0 ? (
						<div className='text-center py-12'>
							<div className='mx-auto h-12 w-12 text-muted-foreground mb-4'>
								<Grid3X3 className='h-12 w-12' />
							</div>
							<h3 className='text-lg font-medium'>No memories yet</h3>
							<p className='text-muted-foreground mt-1'>
								Create your first memory to get started
							</p>
							<Button onClick={handleCreateNew} className='mt-4'>
								<Plus className='h-4 w-4 mr-2' />
								Create Memory
							</Button>
						</div>
					) : (
						<MemoryGrid
							memories={filteredMemories}
							viewMode={viewMode}
							onEdit={handleEditMemory}
							orgId={orgId}
						/>
					)}
				</TabsContent>

				<TabsContent value='chat' className='mt-6'>
					<GeneralChat orgId={orgId} />
				</TabsContent>
			</Tabs>

			{/* Memory Editor Dialog */}
			<MemoryEditorDialog
				open={editorOpen}
				onClose={handleCloseEditor}
				memory={editingMemory}
				orgId={orgId}
			/>
		</div>
	);
}
