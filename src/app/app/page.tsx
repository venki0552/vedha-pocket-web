import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { MemoriesView } from "@/components/app/memories-view";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AppPage() {
	return (
		<div className='space-y-6'>
			<Suspense fallback={<MemoriesViewSkeleton />}>
				<MemoriesWrapper />
			</Suspense>
		</div>
	);
}

function MemoriesViewSkeleton() {
	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Skeleton className='h-8 w-40' />
				<Skeleton className='h-10 w-32' />
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
				{[...Array(8)].map((_, i) => (
					<Skeleton key={i} className='h-48 rounded-lg' />
				))}
			</div>
		</div>
	);
}

async function MemoriesWrapper() {
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

	// Get memories (non-archived)
	const { data: memories } = await supabase
		.from("memories")
		.select("*")
		.eq("org_id", membership.org_id)
		.eq("is_archived", false)
		.order("is_pinned", { ascending: false })
		.order("updated_at", { ascending: false });

	// Get unique tags
	const { data: tagsResult } = await supabase
		.from("memories")
		.select("tags")
		.eq("org_id", membership.org_id)
		.eq("is_archived", false);

	const allTags = new Set<string>();
	tagsResult?.forEach((m) => {
		m.tags?.forEach((tag: string) => allTags.add(tag));
	});

	return (
		<MemoriesView
			memories={memories || []}
			tags={Array.from(allTags)}
			orgId={membership.org_id}
		/>
	);
}
