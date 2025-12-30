import { createClient } from "@/lib/supabase/server";
import { MemoriesView } from "@/components/app/memories-view";
import { redirect } from "next/navigation";

export default async function AppPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Get user's org
	const { data: membership } = await supabase
		.from("memberships")
		.select("org_id")
		.eq("user_id", user.id)
		.single();

	if (!membership) {
		redirect("/login");
	}

	return (
		<div className='space-y-6'>
			<MemoriesView orgId={membership.org_id} />
		</div>
	);
}
