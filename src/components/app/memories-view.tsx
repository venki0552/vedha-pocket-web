"use client";

import { useState, useRef, useCallback } from "react";
import {
	Plus,
	Grid3X3,
	List,
	Search,
	Tag,
	Archive,
	Loader2,
	GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemoryGrid } from "@/components/app/memory-grid";
import { GeneralChat } from "@/components/app/general-chat";
import { MemoryEditorDialog } from "@/components/app/memory-editor-dialog";
import { Badge } from "@/components/ui/badge";
import { MemoryGridSkeleton } from "@/components/app/memory-skeleton";
import { useMemories, useMemoryTags, type Memory } from "@/hooks/use-memories";

interface MemoriesViewProps {
	orgId: string;
}

export function MemoriesView({ orgId }: MemoriesViewProps) {
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [showArchived, setShowArchived] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [editorOpen, setEditorOpen] = useState(false);
	const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
	const [editorViewMode, setEditorViewMode] = useState<"view" | "edit">("edit");
	
	// Resizable panel state (percentage for left panel)
	const [leftPanelWidth, setLeftPanelWidth] = useState(60);
	const containerRef = useRef<HTMLDivElement>(null);
	const isDragging = useRef(false);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		isDragging.current = true;
		document.body.style.cursor = 'col-resize';
		document.body.style.userSelect = 'none';

		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging.current || !containerRef.current) return;
			const containerRect = containerRef.current.getBoundingClientRect();
			const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
			// Clamp between 30% and 80%
			setLeftPanelWidth(Math.min(80, Math.max(30, newWidth)));
		};

		const handleMouseUp = () => {
			isDragging.current = false;
			document.body.style.cursor = '';
			document.body.style.userSelect = '';
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	}, []);

	// Fetch memories with React Query
	const {
		data: memories = [],
		isLoading: memoriesLoading,
		isFetching: memoriesFetching,
	} = useMemories(orgId);
	const { data: tags = [], isLoading: tagsLoading } = useMemoryTags(orgId);

	// Filter memories based on archived state
	const activeMemories = memories.filter((m: Memory) => !m.is_archived);
	const archivedMemories = memories.filter((m: Memory) => m.is_archived);
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
		// React Query will automatically refetch based on invalidation in mutations
	};

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
		);
	};

	return (
		<div ref={containerRef} className='flex h-full overflow-hidden'>
			{/* Left side - Memories (resizable) */}
			<div 
				className='flex flex-col min-h-0 overflow-hidden pr-3'
				style={{ width: `${leftPanelWidth}%` }}
			>
				{/* Header */}
				<div className='flex items-center justify-between gap-4 flex-wrap mb-4 flex-shrink-0'>
					<div className='flex items-center gap-2'>
						<Tabs
							value={showArchived ? "archived" : "active"}
							onValueChange={(v) => setShowArchived(v === "archived")}
						>
							<TabsList>
								<TabsTrigger value='active' className='gap-2'>
									<Grid3X3 className='h-4 w-4' />
									Memories
									<Badge variant='secondary' className='ml-1'>
										{activeMemories.length}
									</Badge>
								</TabsTrigger>
								<TabsTrigger value='archived' className='gap-2'>
									<Archive className='h-4 w-4' />
									Archived
									<Badge variant='secondary' className='ml-1'>
										{archivedMemories.length}
									</Badge>
								</TabsTrigger>
							</TabsList>
						</Tabs>
						{memoriesFetching && !memoriesLoading && (
							<Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
						)}
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
					{tagsLoading ? (
						<div className='flex items-center gap-2'>
							<Tag className='h-4 w-4 text-muted-foreground' />
							<Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
						</div>
					) : (
						tags.length > 0 && (
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
						)
					)}
				</div>

				{/* Memory grid */}
				<div className='flex-1 overflow-y-auto'>
					{memoriesLoading ? (
						<MemoryGridSkeleton count={6} />
					) : filteredMemories.length === 0 ? (
						<div className='text-center py-12'>
							<div className='mx-auto h-12 w-12 text-muted-foreground mb-4'>
								{showArchived ? (
									<Archive className='h-12 w-12' />
								) : (
									<Grid3X3 className='h-12 w-12' />
								)}
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

			{/* Resize handle */}
			<div
				className='w-1 flex-shrink-0 cursor-col-resize group hover:bg-primary/20 transition-colors relative'
				onMouseDown={handleMouseDown}
			>
				<div className='absolute inset-y-0 -left-1 -right-1 flex items-center justify-center'>
					<div className='h-8 w-4 rounded bg-muted border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
						<GripVertical className='h-3 w-3 text-muted-foreground' />
					</div>
				</div>
			</div>

			{/* Right side - Chat (resizable) */}
			<div 
				className='flex flex-col min-h-0 overflow-hidden pl-3'
				style={{ width: `${100 - leftPanelWidth}%` }}
			>
				<h2 className='text-lg font-semibold mb-4 flex items-center gap-2 flex-shrink-0'>
					<Search className='h-5 w-5' />
					General Chat
				</h2>
				<GeneralChat orgId={orgId} />
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
