import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { TaskList } from "@/components/app/task-list";
import { TaskListSkeleton } from "@/components/app/task-list-skeleton";

export default async function TasksPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Tasks</h1>
				<p className='text-muted-foreground'>
					Monitor background processing tasks
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

	// Get tasks for org's pockets
	const { data: pockets } = await supabase
		.from("pockets")
		.select("id")
		.eq("org_id", membership.org_id);

	const pocketIds = pockets?.map((p) => p.id) || [];

	const { data: tasks } = await supabase
		.from("tasks")
		.select(
			`
      *,
      sources(id, title, type)
    `
		)
		.in("pocket_id", pocketIds)
		.order("created_at", { ascending: false })
		.limit(100);

	return <TaskList tasks={tasks || []} />;
}
