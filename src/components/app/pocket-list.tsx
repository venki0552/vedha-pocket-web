"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
	Plus,
	FolderOpen,
	FileText,
	MoreVertical,
	Trash2,
	Loader2,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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

interface Pocket {
	id: string;
	name: string;
	description: string | null;
	is_public: boolean;
	created_at: string;
	updated_at: string;
	canEdit: boolean;
	sourceCount: number;
}

interface PocketListProps {
	pockets: Pocket[];
	orgId: string;
}

export function PocketList({ pockets, orgId }: PocketListProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [pocketToDelete, setPocketToDelete] = useState<Pocket | null>(null);
	const [newPocket, setNewPocket] = useState({ name: "", description: "" });

	const createMutation = useMutation({
		mutationFn: (data: { name: string; description: string }) =>
			api.createPocket(orgId, data.name),
		onSuccess: () => {
			toast({ title: "Pocket created successfully" });
			setCreateDialogOpen(false);
			setNewPocket({ name: "", description: "" });
			router.refresh();
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to create pocket",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (pocketId: string) => api.deletePocket(pocketId),
		onSuccess: () => {
			toast({ title: "Pocket deleted successfully" });
			setDeleteDialogOpen(false);
			setPocketToDelete(null);
			router.refresh();
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to delete pocket",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const handleCreate = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newPocket.name.trim()) return;
		createMutation.mutate(newPocket);
	};

	const handleDelete = () => {
		if (!pocketToDelete) return;
		deleteMutation.mutate(pocketToDelete.id);
	};

	return (
		<div className='space-y-6'>
			{/* Create Pocket Dialog */}
			<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
				<DialogTrigger asChild>
					<Button className='gap-2'>
						<Plus className='h-4 w-4' />
						New Pocket
					</Button>
				</DialogTrigger>
				<DialogContent>
					<form onSubmit={handleCreate}>
						<DialogHeader>
							<DialogTitle>Create New Pocket</DialogTitle>
							<DialogDescription>
								A pocket is a container for your sources. Give it a descriptive
								name.
							</DialogDescription>
						</DialogHeader>
						<div className='grid gap-4 py-4'>
							<div className='grid gap-2'>
								<Label htmlFor='name'>Name</Label>
								<Input
									id='name'
									placeholder='My Research Project'
									value={newPocket.name}
									onChange={(e) =>
										setNewPocket({ ...newPocket, name: e.target.value })
									}
									required
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='description'>Description (optional)</Label>
								<Textarea
									id='description'
									placeholder='What is this pocket about?'
									value={newPocket.description}
									onChange={(e) =>
										setNewPocket({ ...newPocket, description: e.target.value })
									}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => setCreateDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={createMutation.isPending}>
								{createMutation.isPending && (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								)}
								Create Pocket
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Pocket Grid */}
			{pockets.length === 0 ? (
				<Card className='border-dashed'>
					<CardContent className='flex flex-col items-center justify-center py-12'>
						<FolderOpen className='h-12 w-12 text-muted-foreground' />
						<h3 className='mt-4 text-lg font-semibold'>No pockets yet</h3>
						<p className='mt-2 text-center text-sm text-muted-foreground'>
							Create your first pocket to start organizing your knowledge.
						</p>
						<Button
							className='mt-4 gap-2'
							onClick={() => setCreateDialogOpen(true)}
						>
							<Plus className='h-4 w-4' />
							Create Pocket
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{pockets.map((pocket) => (
						<Card key={pocket.id} className='group relative'>
							<Link href={`/app/pocket/${pocket.id}`}>
								<CardHeader>
									<div className='flex items-start justify-between'>
										<div className='space-y-1'>
											<CardTitle className='flex items-center gap-2'>
												<FolderOpen className='h-5 w-5 text-primary' />
												{pocket.name}
											</CardTitle>
											{pocket.description && (
												<CardDescription className='line-clamp-2'>
													{pocket.description}
												</CardDescription>
											)}
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className='flex items-center gap-4 text-sm text-muted-foreground'>
										<div className='flex items-center gap-1'>
											<FileText className='h-4 w-4' />
											{pocket.sourceCount} sources
										</div>
										{pocket.is_public && (
											<Badge variant='secondary'>Public</Badge>
										)}
									</div>
								</CardContent>
							</Link>
							{pocket.canEdit && (
								<div className='absolute right-4 top-4'>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant='ghost'
												size='icon'
												className='opacity-0 group-hover:opacity-100'
											>
												<MoreVertical className='h-4 w-4' />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='end'>
											<DropdownMenuItem
												className='text-destructive'
												onClick={(e) => {
													e.preventDefault();
													setPocketToDelete(pocket);
													setDeleteDialogOpen(true);
												}}
											>
												<Trash2 className='mr-2 h-4 w-4' />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							)}
						</Card>
					))}
				</div>
			)}

			{/* Delete Confirmation */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Pocket</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{pocketToDelete?.name}"? This
							will permanently delete all sources and conversations in this
							pocket. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						>
							{deleteMutation.isPending ? (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							) : (
								<Trash2 className='mr-2 h-4 w-4' />
							)}
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
