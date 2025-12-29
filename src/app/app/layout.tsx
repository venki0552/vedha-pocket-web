import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Get user's orgs
	const { data: memberships } = await supabase
		.from("memberships")
		.select("org_id, role, orgs(id, name, slug)")
		.eq("user_id", user.id);

	// If no org, create one
	if (!memberships || memberships.length === 0) {
		const { data: org } = await supabase
			.from("orgs")
			.insert({
				name: "Personal",
				slug: `personal-${user.id.substring(0, 8)}`,
				owner_id: user.id,
			})
			.select()
			.single();

		if (org) {
			await supabase.from("memberships").insert({
				org_id: org.id,
				user_id: user.id,
				role: "owner",
			});
		}

		// Reload to get new org
		redirect("/app");
	}

	const orgs = memberships.map((m) => {
		const org = Array.isArray(m.orgs) ? m.orgs[0] : m.orgs;
		return {
			id: m.org_id,
			name: org?.name ?? "Unknown",
			slug: org?.slug ?? "",
			role: m.role,
		};
	});

	return (
		<AppShell user={user} orgs={orgs}>
			{children}
		</AppShell>
	);
}
