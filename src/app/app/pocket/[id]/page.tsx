import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PocketView } from "@/components/app/pocket-view";

interface PocketPageProps {
	params: {
		id: string;
	};
}

export default async function PocketPage({ params }: PocketPageProps) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return notFound();
	}

	const { data: pocket } = await supabase
		.from("pockets")
		.select(
			`
      *,
      orgs(id, name)
    `
		)
		.eq("id", params.id)
		.single();

	if (!pocket) {
		return notFound();
	}

	// Check access
	const { data: membership } = await supabase
		.from("memberships")
		.select("role")
		.eq("org_id", pocket.org_id)
		.eq("user_id", user.id)
		.single();

	if (!membership) {
		return notFound();
	}

	// Get sources
	const { data: sources } = await supabase
		.from("sources")
		.select("*")
		.eq("pocket_id", pocket.id)
		.order("created_at", { ascending: false });

	// Get conversations
	const { data: conversations } = await supabase
		.from("conversations")
		.select("*")
		.eq("pocket_id", pocket.id)
		.eq("user_id", user.id)
		.order("updated_at", { ascending: false })
		.limit(10);

	const canEdit =
		pocket.created_by === user.id ||
		membership.role === "owner" ||
		membership.role === "admin";

	return (
		<PocketView
			pocket={pocket}
			sources={sources || []}
			conversations={conversations || []}
			canEdit={canEdit}
			userId={user.id}
		/>
	);
}
