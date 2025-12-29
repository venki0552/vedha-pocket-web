import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { TaskList } from "@/components/app/task-list";
import { TaskListSkeleton } from "@/components/app/task-list-skeleton";

export default async function TasksPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Processing Jobs</h1>
				<p className='text-muted-foreground'>
					Monitor background source processing
				</p>
			</div>

			<Suspense fallback={<TaskListSkeleton />}>
				<TaskListWrapper />
			</Suspense>
		</div>
	);
}

async function TaskListWrapper() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	// Get user's org
	const { data: membership } = await supabase
		.from("memberships")
		.select("org_id")
		.eq("user_id", user.id)
		.single();

	if (!membership) {
		return null;
	}

	// Get sources for org's pockets (these are the processing jobs)
	const { data: pockets } = await supabase
		.from("pockets")
		.select("id, name")
		.eq("org_id", membership.org_id);

	const pocketIds = pockets?.map((p) => p.id) || [];
	const pocketMap = new Map(pockets?.map((p) => [p.id, p.name]) || []);

	const { data: sources } = await supabase
		.from("sources")
		.select("*")
		.in("pocket_id", pocketIds)
		.order("created_at", { ascending: false })
		.limit(100);

	// Map sources to task-like structure for the component
	const tasks = (sources || []).map((source) => ({
		id: source.id as string,
		type: (source.type === "url" ? "ingest-url" : "ingest-file") as "ingest-url" | "ingest-file",
		status: mapSourceStatus(source.status) as "pending" | "processing" | "completed" | "failed",
		progress: getProgressFromStatus(source.status),
		error_message: source.error_message as string | null,
		attempts: 1,
		created_at: source.created_at as string,
		updated_at: source.updated_at as string,
		sources: {
			id: source.id as string,
			title: source.title as string,
			type: source.type as string,
		},
	}));

	return <TaskList tasks={tasks} />;
}

// Map source status to UI status
function mapSourceStatus(
	status: string
): "pending" | "processing" | "completed" | "failed" {
	switch (status) {
		case "queued":
			return "pending";
		case "extracting":
		case "chunking":
		case "embedding":
			return "processing";
		case "ready":
			return "completed";
		case "failed":
			return "failed";
		default:
			return "pending";
	}
}

// Get progress percentage from status
function getProgressFromStatus(status: string): number {
	switch (status) {
		case "queued":
			return 0;
		case "extracting":
			return 25;
		case "chunking":
			return 50;
		case "embedding":
			return 75;
		case "ready":
			return 100;
		case "failed":
			return 0;
		default:
			return 0;
	}
}
