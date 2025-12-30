"use client";

import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import {
	MoreVertical,
	Pin,
	Trash2,
	Archive,
	Share2,
	Globe,
	FileEdit,
	ArchiveRestore,
	ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
	useUpdateMemory,
	useDeleteMemory,
	usePublishMemory,
} from "@/hooks/use-memories";

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

interface MemoryGridProps {
	memories: Memory[];
	viewMode: "grid" | "list";
	onEdit: (memory: Memory) => void;
	orgId: string;
	isArchiveView?: boolean;
}

// Google Keep color mapping
const colorClasses: Record<string, string> = {
	default: "bg-card",
	coral: "bg-red-100 dark:bg-red-950",
	peach: "bg-orange-100 dark:bg-orange-950",
	sand: "bg-yellow-100 dark:bg-yellow-950",
	mint: "bg-emerald-100 dark:bg-emerald-950",
	sage: "bg-green-100 dark:bg-green-950",
	fog: "bg-slate-100 dark:bg-slate-950",
	storm: "bg-blue-100 dark:bg-blue-950",
	dusk: "bg-indigo-100 dark:bg-indigo-950",
	blossom: "bg-pink-100 dark:bg-pink-950",
	clay: "bg-amber-100 dark:bg-amber-950",
	chalk: "bg-gray-100 dark:bg-gray-800",
};

export function MemoryGrid({
	memories,
	viewMode,
	onEdit,
	orgId,
	isArchiveView = false,
}: MemoryGridProps) {
	const { toast } = useToast();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [memoryToDelete, setMemoryToDelete] = useState<Memory | null>(null);

	// React Query mutations
	const updateMutation = useUpdateMemory();
	const deleteMutation = useDeleteMemory();
	const publishMutation = usePublishMemory();

	const handleDelete = async () => {
		if (!memoryToDelete) return;

		try {
			await deleteMutation.mutateAsync(memoryToDelete.id);

			toast({
				title: "Memory deleted",
				description: "Your memory has been deleted.",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete memory. Please try again.",
				variant: "destructive",
			});
		} finally {
			setDeleteDialogOpen(false);
			setMemoryToDelete(null);
		}
	};

	const handleTogglePin = async (memory: Memory) => {
		try {
			await updateMutation.mutateAsync({
				id: memory.id,
				is_pinned: !memory.is_pinned,
			});

			toast({
				title: memory.is_pinned ? "Unpinned" : "Pinned",
				description: memory.is_pinned
					? "Memory unpinned"
					: "Memory pinned to top",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update memory",
				variant: "destructive",
			});
		}
	};

	const handleToggleArchive = async (memory: Memory) => {
		try {
			await updateMutation.mutateAsync({
				id: memory.id,
				is_archived: !memory.is_archived,
			});

			toast({
				title: memory.is_archived ? "Restored" : "Archived",
				description: memory.is_archived ? "Memory restored" : "Memory archived",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update memory",
				variant: "destructive",
			});
		}
	};

	const handlePublish = async (memory: Memory) => {
		try {
			await publishMutation.mutateAsync(memory.id);

			toast({
				title: "Published",
				description: "Your memory is now searchable in General Chat",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to publish memory",
				variant: "destructive",
			});
		}
	};

	// Separate pinned and unpinned
	const pinnedMemories = memories.filter((m) => m.is_pinned);
	const unpinnedMemories = memories.filter((m) => !m.is_pinned);

	const MemoryCard = ({ memory }: { memory: Memory }) => (
		<div
			className={cn(
				"group relative rounded-lg border p-5 transition-shadow hover:shadow-md cursor-pointer min-h-[180px]",
				colorClasses[memory.color] || colorClasses.default,
				viewMode === "list" && "flex items-center gap-4 min-h-0"
			)}
			onClick={() => onEdit(memory)}
		>
			{/* Status icons - top right */}
			<div className='absolute top-3 right-10 flex items-center gap-1.5'>
				{memory.is_pinned && (
					<Pin className='h-4 w-4 text-muted-foreground fill-current' />
				)}
				{memory.status === "published" && (
					<Globe className='h-4 w-4 text-primary' />
				)}
			</div>

			{/* Content */}
			<div
				className={cn("flex-1 flex flex-col", viewMode === "list" && "min-w-0")}
			>
				{memory.title && (
					<h3
						className={cn(
							"font-semibold text-base line-clamp-1",
							viewMode === "grid" && "mb-2"
						)}
					>
						{memory.title}
					</h3>
				)}
				<p
					className={cn(
						"text-sm text-muted-foreground flex-1",
						viewMode === "grid" ? "line-clamp-5" : "line-clamp-1"
					)}
				>
					{memory.content || "Empty memory"}
				</p>

				{/* Tags */}
				{memory.tags.length > 0 && (
					<div className='flex flex-wrap gap-1 mt-3'>
						{memory.tags.slice(0, 3).map((tag) => (
							<Badge key={tag} variant='secondary' className='text-xs'>
								{tag}
							</Badge>
						))}
						{memory.tags.length > 3 && (
							<Badge variant='secondary' className='text-xs'>
								+{memory.tags.length - 3}
							</Badge>
						)}
					</div>
				)}

				{/* Footer */}
				<div className='flex items-center justify-between mt-3 text-xs text-muted-foreground'>
					<span
						title={format(new Date(memory.updated_at), "PPpp")}
						className='hover:underline cursor-help'
					>
						{formatDistanceToNow(new Date(memory.updated_at), {
							addSuffix: true,
						})}
					</span>
					<div className='flex items-center gap-1.5'>
						{memory.status === "draft" && <FileEdit className='h-3.5 w-3.5' />}
					</div>
				</div>
			</div>

			{/* Actions menu */}
			<div
				className='absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity'
				onClick={(e) => e.stopPropagation()}
			>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon' className='h-8 w-8'>
							<MoreVertical className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem onClick={() => handleTogglePin(memory)}>
							<Pin className='mr-2 h-4 w-4' />
							{memory.is_pinned ? "Unpin" : "Pin"}
						</DropdownMenuItem>
						{memory.status === "draft" && (
							<DropdownMenuItem onClick={() => handlePublish(memory)}>
								<Globe className='mr-2 h-4 w-4' />
								Publish
							</DropdownMenuItem>
						)}
						<DropdownMenuItem>
							<Share2 className='mr-2 h-4 w-4' />
							Share
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => handleToggleArchive(memory)}>
							{memory.is_archived ? (
								<>
									<ArchiveRestore className='mr-2 h-4 w-4' />
									Restore
								</>
							) : (
								<>
									<Archive className='mr-2 h-4 w-4' />
									Archive
								</>
							)}
						</DropdownMenuItem>
						<DropdownMenuItem
							className='text-destructive'
							onClick={() => {
								setMemoryToDelete(memory);
								setDeleteDialogOpen(true);
							}}
						>
							<Trash2 className='mr-2 h-4 w-4' />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);

	return (
		<>
			{/* Pinned memories */}
			{pinnedMemories.length > 0 && (
				<div className='mb-8'>
					<h3 className='text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2'>
						<Pin className='h-4 w-4' />
						Pinned
					</h3>
					<div
						className={cn(
							viewMode === "grid"
								? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
								: "flex flex-col gap-2"
						)}
					>
						{pinnedMemories.map((memory) => (
							<MemoryCard key={memory.id} memory={memory} />
						))}
					</div>
				</div>
			)}

			{/* Unpinned memories */}
			{unpinnedMemories.length > 0 && (
				<div>
					{pinnedMemories.length > 0 && (
						<h3 className='text-sm font-medium text-muted-foreground mb-3'>
							Others
						</h3>
					)}
					<div
						className={cn(
							viewMode === "grid"
								? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
								: "flex flex-col gap-2"
						)}
					>
						{unpinnedMemories.map((memory) => (
							<MemoryCard key={memory.id} memory={memory} />
						))}
					</div>
				</div>
			)}

			{/* Delete confirmation dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Memory</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this memory? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={deleteMutation.isPending}
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						>
							{deleteMutation.isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
