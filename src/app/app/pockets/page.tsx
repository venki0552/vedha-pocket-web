import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { PocketList } from "@/components/app/pocket-list";
import { PocketListSkeleton } from "@/components/app/pocket-list-skeleton";

export default async function PocketsPage() {
	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Pockets</h1>
					<p className='text-muted-foreground'>
						Isolated knowledge containers for focused conversations
					</p>
				</div>
			</div>

			<Suspense fallback={<PocketListSkeleton />}>
				<PocketListWrapper />
			</Suspense>
		</div>
	);
}

async function PocketListWrapper() {
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

	// Get pockets
	const { data: pockets } = await supabase
		.from("pockets")
		.select(
			`
      *,
      sources:sources(count)
    `
		)
		.eq("org_id", membership.org_id)
		.order("updated_at", { ascending: false });

	// Get pocket member info for access
	const pocketIds = pockets?.map((p) => p.id) || [];
	const { data: pocketMembers } = await supabase
		.from("pocket_members")
		.select("pocket_id, role")
		.eq("user_id", user.id)
		.in("pocket_id", pocketIds);

	const pocketMemberMap = new Map(
		pocketMembers?.map((pm) => [
			pm.pocket_id,
			pm.role === "owner" || pm.role === "member",
		]) || []
	);

	const pocketsWithAccess =
		pockets?.map((pocket) => ({
			...pocket,
			canEdit:
				pocket.created_by === user.id ||
				pocketMemberMap.get(pocket.id) === true,
			sourceCount: pocket.sources?.[0]?.count || 0,
		})) || [];

	return <PocketList pockets={pocketsWithAccess} orgId={membership.org_id} />;
}
