import { createClient } from "@/lib/supabase/server";
import { AnalyticsDashboard } from "@/components/app/analytics-dashboard";

export default async function AnalyticsPage() {
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

	// Get stats
	const { count: pocketCount } = await supabase
		.from("pockets")
		.select("*", { count: "exact", head: true })
		.eq("org_id", membership.org_id);

	const { data: pockets } = await supabase
		.from("pockets")
		.select("id")
		.eq("org_id", membership.org_id);

	const pocketIds = pockets?.map((p) => p.id) || [];

	const { count: sourceCount } = await supabase
		.from("sources")
		.select("*", { count: "exact", head: true })
		.in("pocket_id", pocketIds);

	const { count: chunkCount } = await supabase
		.from("chunks")
		.select("*", { count: "exact", head: true })
		.in("source_id", pocketIds.length > 0 ? pocketIds : ["none"]);

	const { count: conversationCount } = await supabase
		.from("conversations")
		.select("*", { count: "exact", head: true })
		.eq("created_by", user.id);

	const { count: messageCount } = await supabase
		.from("messages")
		.select("*", { count: "exact", head: true })
		.in("conversation_id", pocketIds.length > 0 ? pocketIds : ["none"]);

	const stats = {
		pockets: pocketCount || 0,
		sources: sourceCount || 0,
		chunks: chunkCount || 0,
		conversations: conversationCount || 0,
		messages: messageCount || 0,
	};

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Analytics</h1>
				<p className='text-muted-foreground'>Overview of your knowledge base</p>
			</div>

			<AnalyticsDashboard stats={stats} />
		</div>
	);
}
