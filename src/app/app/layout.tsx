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
	let { data: memberships, error: membershipError } = await supabase
		.from("memberships")
		.select("org_id, role, orgs(id, name, slug)")
		.eq("user_id", user.id);

	// If no org, create one
	if (!memberships || memberships.length === 0) {
		// Check if user already has an org as owner (in case membership insert failed previously)
		const { data: existingOrg } = await supabase
			.from("orgs")
			.select("id, name, slug")
			.eq("owner_id", user.id)
			.single();

		if (existingOrg) {
			// Org exists but membership doesn't - create the membership
			const { error: insertMembershipError } = await supabase.from("memberships").insert({
				org_id: existingOrg.id,
				user_id: user.id,
				role: "owner",
			});

			if (!insertMembershipError) {
				// Successfully created membership, use this org
				memberships = [{
					org_id: existingOrg.id,
					role: "owner",
					orgs: [existingOrg]
				}];
			}
		} else {
			// Create new org
			const { data: org, error: orgError } = await supabase
				.from("orgs")
				.insert({
					name: "Personal",
					slug: `personal-${user.id.substring(0, 8)}`,
					owner_id: user.id,
				})
				.select()
				.single();

			if (org) {
				const { error: membershipInsertError } = await supabase.from("memberships").insert({
					org_id: org.id,
					user_id: user.id,
					role: "owner",
				});

				if (!membershipInsertError) {
					// Successfully created org and membership
					memberships = [{
						org_id: org.id,
						role: "owner",
						orgs: [org]
					}];
				}
			}
		}
	}

	// If still no memberships after creation attempt, show error state
	if (!memberships || memberships.length === 0) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Setup Error</h1>
					<p className="text-muted-foreground mt-2">
						Unable to set up your workspace. Please try logging out and back in.
					</p>
					<form action="/api/auth/signout" method="POST" className="mt-4">
						<button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded">
							Sign Out
						</button>
					</form>
				</div>
			</div>
		);
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
