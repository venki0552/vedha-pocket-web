"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Globe, FileEdit, Palette, Tag, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { TiptapEditor } from "@/components/app/tiptap-editor";

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

interface MemoryEditorDialogProps {
	open: boolean;
	onClose: () => void;
	memory: Memory | null;
	orgId: string;
	initialViewMode?: "view" | "edit";
}

// Google Keep colors
const colors = [
	{ name: "default", class: "bg-card border" },
	{ name: "coral", class: "bg-red-100 dark:bg-red-950" },
	{ name: "peach", class: "bg-orange-100 dark:bg-orange-950" },
	{ name: "sand", class: "bg-yellow-100 dark:bg-yellow-950" },
	{ name: "mint", class: "bg-emerald-100 dark:bg-emerald-950" },
	{ name: "sage", class: "bg-green-100 dark:bg-green-950" },
	{ name: "fog", class: "bg-slate-100 dark:bg-slate-950" },
	{ name: "storm", class: "bg-blue-100 dark:bg-blue-950" },
	{ name: "dusk", class: "bg-indigo-100 dark:bg-indigo-950" },
	{ name: "blossom", class: "bg-pink-100 dark:bg-pink-950" },
	{ name: "clay", class: "bg-amber-100 dark:bg-amber-950" },
	{ name: "chalk", class: "bg-gray-100 dark:bg-gray-800" },
];

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

export function MemoryEditorDialog({
	open,
	onClose,
	memory,
	orgId,
	initialViewMode = "edit",
}: MemoryEditorDialogProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [viewMode, setViewMode] = useState<"view" | "edit">(initialViewMode);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [contentHtml, setContentHtml] = useState("");
	const [color, setColor] = useState("default");
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);

	// Reset form when memory changes
	useEffect(() => {
		setViewMode(initialViewMode);
	}, [initialViewMode, open]);

	useEffect(() => {
		if (memory) {
			setTitle(memory.title || "");
			setContent(memory.content || "");
			setContentHtml(memory.content_html || memory.content || "");
			setColor(memory.color || "default");
			setTags(memory.tags || []);
		} else {
			setTitle("");
			setContent("");
			setContentHtml("");
			setColor("default");
			setTags([]);
		}
		setTagInput("");
	}, [memory, open]);

	const handleSave = async () => {
		setIsSaving(true);
		try {
			if (memory) {
				await api.updateMemory(memory.id, {
					title: title || undefined,
					content,
					content_html: contentHtml,
					color,
					tags,
				});
			} else {
				await api.createMemory({
					org_id: orgId,
					title: title || undefined,
					content,
					content_html: contentHtml,
					color,
					tags,
				});
			}

			toast({
				title: memory ? "Memory updated" : "Memory created",
				description: memory
					? "Your changes have been saved."
					: "Your memory has been created.",
			});

			onClose();
			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to save memory. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handlePublish = async () => {
		if (!memory) {
			// First save, then publish
			setIsPublishing(true);
			try {
				// Create memory first
				const { data: newMemory } = await api.createMemory({
					org_id: orgId,
					title: title || undefined,
					content,
					content_html: contentHtml,
					color,
					tags,
				});

				// Then publish
				await api.publishMemory(newMemory.id);

				toast({
					title: "Memory published",
					description: "Your memory is now searchable in General Chat.",
				});

				onClose();
				router.refresh();
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to publish memory. Please try again.",
					variant: "destructive",
				});
			} finally {
				setIsPublishing(false);
			}
		} else {
			// Save changes first, then publish
			setIsPublishing(true);
			try {
				// Save changes
				await api.updateMemory(memory.id, {
					title: title || undefined,
					content,
					content_html: contentHtml,
					color,
					tags,
				});

				// Then publish
				await api.publishMemory(memory.id);

				toast({
					title: "Memory published",
					description: "Your memory is now searchable in General Chat.",
				});

				onClose();
				router.refresh();
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to publish memory. Please try again.",
					variant: "destructive",
				});
			} finally {
				setIsPublishing(false);
			}
		}
	};

	const addTag = () => {
		const tag = tagInput.trim().toLowerCase();
		if (tag && !tags.includes(tag)) {
			setTags([...tags, tag]);
		}
		setTagInput("");
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((t) => t !== tagToRemove));
	};

	const isPublished = memory?.status === "published";
	const hasChanges =
		memory &&
		(title !== (memory.title || "") ||
			content !== (memory.content || "") ||
			color !== memory.color ||
			JSON.stringify(tags) !== JSON.stringify(memory.tags));

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent
				className={cn(
					"sm:max-w-4xl max-h-[85vh] h-[85vh] overflow-hidden flex flex-col",
					colorClasses[color]
				)}
			>
				<DialogHeader className='flex flex-row items-center justify-between'>
					<DialogTitle className='text-lg font-medium'>
						{memory
							? viewMode === "view"
								? memory.title || "Untitled Memory"
								: "Edit Memory"
							: "New Memory"}
					</DialogTitle>
					<div className='flex items-center gap-2'>
						{viewMode === "view" && memory && (
							<Button
								variant='outline'
								size='sm'
								onClick={() => setViewMode("edit")}
							>
								<FileEdit className='h-4 w-4 mr-2' />
								Edit
							</Button>
						)}
						{isPublished ? (
							<Badge variant='default'>
								<Globe className='h-3 w-3 mr-1' />
								Published
							</Badge>
						) : (
							<Badge variant='outline'>
								<FileEdit className='h-3 w-3 mr-1' />
								Draft
							</Badge>
						)}
					</div>
				</DialogHeader>

				{viewMode === "view" && memory ? (
					/* View Mode - Rendered HTML */
					<div className='flex-1 overflow-y-auto space-y-4 pr-2'>
						{/* Rendered content */}
						<div
							className='prose prose-sm dark:prose-invert max-w-none min-h-[200px]'
							dangerouslySetInnerHTML={{
								__html: memory.content_html || memory.content,
							}}
						/>

						{/* Tags */}
						{memory.tags.length > 0 && (
							<div className='flex flex-wrap gap-2 pt-4 border-t'>
								{memory.tags.map((tag) => (
									<Badge key={tag} variant='secondary'>
										{tag}
									</Badge>
								))}
							</div>
						)}
					</div>
				) : (
					/* Edit Mode */
					<div className='flex-1 overflow-y-auto space-y-4 pr-2'>
						{/* Title */}
						<Input
							placeholder='Title'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className='text-lg font-medium border-0 bg-transparent focus-visible:ring-0 px-0'
						/>

						{/* Content - Tiptap Editor */}
						<TiptapEditor
							content={contentHtml || content}
							onChange={(text, html) => {
								setContent(text);
								setContentHtml(html);
							}}
							className='border-0 bg-transparent min-h-[300px]'
						/>

						{/* Tags */}
						<div className='space-y-2'>
							<div className='flex flex-wrap gap-2'>
								{tags.map((tag) => (
									<Badge key={tag} variant='secondary' className='gap-1'>
										{tag}
										<button
											onClick={() => removeTag(tag)}
											className='ml-1 hover:text-destructive'
										>
											<X className='h-3 w-3' />
										</button>
									</Badge>
								))}
							</div>
							<div className='flex gap-2'>
								<Input
									placeholder='Add tag...'
									value={tagInput}
									onChange={(e) => setTagInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addTag();
										}
									}}
									className='max-w-[200px]'
								/>
								<Button variant='outline' size='sm' onClick={addTag}>
									<Tag className='h-4 w-4' />
								</Button>
							</div>
						</div>
					</div>
				)}

				{/* Footer */}
				{viewMode === "view" ? (
					<div className='flex items-center justify-end pt-4 border-t'>
						<Button variant='outline' onClick={onClose}>
							Close
						</Button>
					</div>
				) : (
					<div className='flex items-center justify-between pt-4 border-t'>
						<div className='flex items-center gap-2'>
							{/* Color picker */}
							<Popover>
								<PopoverTrigger asChild>
									<Button variant='outline' size='icon'>
										<Palette className='h-4 w-4' />
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-2'>
									<div className='grid grid-cols-4 gap-2'>
										{colors.map((c) => (
											<button
												key={c.name}
												className={cn(
													"h-8 w-8 rounded-full border-2 transition-all",
													c.class,
													color === c.name
														? "border-primary ring-2 ring-primary ring-offset-2"
														: "border-transparent hover:border-muted-foreground"
												)}
												onClick={() => setColor(c.name)}
											>
												{color === c.name && (
													<Check className='h-4 w-4 mx-auto' />
												)}
											</button>
										))}
									</div>
								</PopoverContent>
							</Popover>
						</div>

						<div className='flex items-center gap-2'>
							<Button variant='outline' onClick={onClose}>
								Cancel
							</Button>
							<Button
								variant='outline'
								onClick={handleSave}
								disabled={isSaving || isPublishing}
							>
								{isSaving ? (
									<Loader2 className='h-4 w-4 mr-2 animate-spin' />
								) : null}
								Save Draft
							</Button>
							{!isPublished && (
								<Button
									onClick={handlePublish}
									disabled={isSaving || isPublishing || !content.trim()}
								>
									{isPublishing ? (
										<Loader2 className='h-4 w-4 mr-2 animate-spin' />
									) : (
										<Globe className='h-4 w-4 mr-2' />
									)}
									Publish
								</Button>
							)}
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
