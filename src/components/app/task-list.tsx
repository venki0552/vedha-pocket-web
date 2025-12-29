"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import {
	RefreshCw,
	CheckCircle2,
	XCircle,
	Clock,
	Loader2,
	FileText,
	Globe,
} from "lucide-react";

interface Task {
	id: string;
	type: "ingest-url" | "ingest-file";
	status: "pending" | "processing" | "completed" | "failed";
	progress: number | null;
	error_message: string | null;
	attempts: number;
	created_at: string;
	updated_at: string;
	sources: {
		id: string;
		title: string;
		type: string;
	} | null;
}

interface TaskListProps {
	tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
	const router = useRouter();
	const [retryingId, setRetryingId] = useState<string | null>(null);

	const retryMutation = useMutation({
		mutationFn: (taskId: string) => api.retryTask(taskId),
		onSuccess: () => {
			toast({ title: "Task queued for retry" });
			router.refresh();
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to retry task",
				description: error.message,
				variant: "destructive",
			});
		},
		onSettled: () => {
			setRetryingId(null);
		},
	});

	const getStatusIcon = (status: Task["status"]) => {
		switch (status) {
			case "completed":
				return <CheckCircle2 className='h-4 w-4 text-green-500' />;
			case "failed":
				return <XCircle className='h-4 w-4 text-red-500' />;
			case "processing":
				return <Loader2 className='h-4 w-4 animate-spin text-blue-500' />;
			case "pending":
				return <Clock className='h-4 w-4 text-yellow-500' />;
		}
	};

	const getStatusBadge = (status: Task["status"]) => {
		switch (status) {
			case "completed":
				return <Badge variant='default'>Completed</Badge>;
			case "failed":
				return <Badge variant='destructive'>Failed</Badge>;
			case "processing":
				return <Badge variant='secondary'>Processing</Badge>;
			case "pending":
				return <Badge variant='outline'>Pending</Badge>;
		}
	};

	const stats = {
		total: tasks.length,
		completed: tasks.filter((t) => t.status === "completed").length,
		failed: tasks.filter((t) => t.status === "failed").length,
		processing: tasks.filter((t) => t.status === "processing").length,
		pending: tasks.filter((t) => t.status === "pending").length,
	};

	return (
		<div className='space-y-6'>
			{/* Stats */}
			<div className='grid gap-4 md:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Tasks</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Completed</CardTitle>
						<CheckCircle2 className='h-4 w-4 text-green-500' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.completed}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Processing</CardTitle>
						<Loader2 className='h-4 w-4 text-blue-500' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{stats.processing + stats.pending}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Failed</CardTitle>
						<XCircle className='h-4 w-4 text-red-500' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.failed}</div>
					</CardContent>
				</Card>
			</div>

			{/* Refresh button */}
			<div className='flex justify-end'>
				<Button variant='outline' size='sm' onClick={() => router.refresh()}>
					<RefreshCw className='mr-2 h-4 w-4' />
					Refresh
				</Button>
			</div>

			{/* Task Table */}
			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Source</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Progress</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tasks.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className='text-center py-8 text-muted-foreground'
								>
									No tasks found
								</TableCell>
							</TableRow>
						) : (
							tasks.map((task) => (
								<TableRow key={task.id}>
									<TableCell>
										<div className='flex items-center gap-2'>
											{task.sources?.type === "url" ? (
												<Globe className='h-4 w-4 text-blue-500' />
											) : (
												<FileText className='h-4 w-4 text-orange-500' />
											)}
											<span className='font-medium'>
												{task.sources?.title || "Unknown"}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant='outline'>
											{task.type === "ingest-url" ? "URL" : "File"}
										</Badge>
									</TableCell>
									<TableCell>
										<div className='flex items-center gap-2'>
											{getStatusIcon(task.status)}
											{getStatusBadge(task.status)}
										</div>
										{task.error_message && (
											<p className='mt-1 text-xs text-destructive'>
												{task.error_message}
											</p>
										)}
									</TableCell>
									<TableCell>
										{task.progress !== null && task.status === "processing" ? (
											<div className='w-24'>
												<Progress value={task.progress} className='h-2' />
												<span className='text-xs text-muted-foreground'>
													{task.progress}%
												</span>
											</div>
										) : (
											"-"
										)}
									</TableCell>
									<TableCell className='text-muted-foreground'>
										{formatDistanceToNow(new Date(task.created_at), {
											addSuffix: true,
										})}
									</TableCell>
									<TableCell>
										{task.status === "failed" && (
											<Button
												variant='ghost'
												size='sm'
												onClick={() => {
													setRetryingId(task.id);
													retryMutation.mutate(task.id);
												}}
												disabled={retryingId === task.id}
											>
												{retryingId === task.id ? (
													<Loader2 className='h-4 w-4 animate-spin' />
												) : (
													<RefreshCw className='h-4 w-4' />
												)}
											</Button>
										)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
}
