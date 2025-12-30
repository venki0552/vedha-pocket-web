"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Grid3X3, List, Search, Tag, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
	const [showArchived, setShowArchived] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [editorOpen, setEditorOpen] = useState(false);
	const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
	const [editorViewMode, setEditorViewMode] = useState<"view" | "edit">("edit");

	// Filter memories based on archived state
	const activeMemories = memories.filter((m) => !m.is_archived);
	const archivedMemories = memories.filter((m) => m.is_archived);
	const displayMemories = showArchived ? archivedMemories : activeMemories;

	// Filter memories
	const filteredMemories = displayMemories.filter((memory) => {
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
		setEditorViewMode("edit");
		setEditorOpen(true);
	};

	const handleEditMemory = (memory: Memory) => {
		setEditingMemory(memory);
		// If draft, go straight to edit; if published, show view first
		setEditorViewMode(memory.status === "draft" ? "edit" : "view");
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
		<div className='flex h-[calc(100vh-8rem)] gap-6'>
			{/* Left side - Memories (60%) */}
			<div className='w-[60%] flex flex-col overflow-hidden'>
				{/* Header */}
				<div className='flex items-center justify-between gap-4 flex-wrap mb-4'>
					<div className='flex items-center gap-2'>
						<Tabs value={showArchived ? "archived" : "active"} onValueChange={(v) => setShowArchived(v === "archived")}>
							<TabsList>
								<TabsTrigger value='active' className='gap-2'>
									<Grid3X3 className='h-4 w-4' />
									Memories
									<Badge variant="secondary" className="ml-1">{activeMemories.length}</Badge>
								</TabsTrigger>
								<TabsTrigger value='archived' className='gap-2'>
									<Archive className='h-4 w-4' />
									Archived
									<Badge variant="secondary" className="ml-1">{archivedMemories.length}</Badge>
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					<div className='flex items-center gap-2'>
						<Button onClick={handleCreateNew} size='sm'>
							<Plus className='h-4 w-4 mr-2' />
							New Memory
						</Button>
					</div>
				</div>

				{/* Search and filters */}
				<div className='flex flex-col gap-4 mb-4'>
					<div className='flex items-center gap-4'>
						<div className='relative flex-1'>
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

				{/* Memory grid */}
				<div className='flex-1 overflow-y-auto'>
					{filteredMemories.length === 0 ? (
						<div className='text-center py-12'>
							<div className='mx-auto h-12 w-12 text-muted-foreground mb-4'>
								{showArchived ? <Archive className='h-12 w-12' /> : <Grid3X3 className='h-12 w-12' />}
							</div>
							<h3 className='text-lg font-medium'>
								{showArchived ? "No archived memories" : "No memories yet"}
							</h3>
							<p className='text-muted-foreground mt-1'>
								{showArchived 
									? "Archived memories will appear here" 
									: "Create your first memory to get started"}
							</p>
							{!showArchived && (
								<Button onClick={handleCreateNew} className='mt-4'>
									<Plus className='h-4 w-4 mr-2' />
									Create Memory
								</Button>
							)}
						</div>
					) : (
						<MemoryGrid
							memories={filteredMemories}
							viewMode={viewMode}
							onEdit={handleEditMemory}
							orgId={orgId}
							isArchiveView={showArchived}
						/>
					)}
				</div>
			</div>

			{/* Right side - Chat (40%) */}
			<div className='w-[40%] border-l pl-6 flex flex-col overflow-hidden'>
				<h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
					<Search className='h-5 w-5' />
					General Chat
				</h2>
				<div className='flex-1 overflow-hidden'>
					<GeneralChat orgId={orgId} />
				</div>
			</div>

			{/* Memory Editor Dialog */}
			<MemoryEditorDialog
				open={editorOpen}
				onClose={handleCloseEditor}
				memory={editingMemory}
				orgId={orgId}
				initialViewMode={editorViewMode}
			/>
		</div>
	);
}
