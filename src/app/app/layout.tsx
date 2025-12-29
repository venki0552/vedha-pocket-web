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

	// Get user's memberships with org details (READ ONLY - no inserts from web)
	// Orgs are auto-created by database trigger on signup
	const { data: memberships, error: membershipError } = await supabase
		.from("memberships")
		.select("org_id, role, orgs(id, name, slug)")
		.eq("user_id", user.id);

	// If no memberships, the signup trigger may have failed
	if (!memberships || memberships.length === 0) {
		const debugInfo = {
			userId: user.id,
			email: user.email,
			error: membershipError?.message || "No memberships found",
			hint: "Org should be auto-created on signup. Try signing out and creating a new account.",
		};
		console.error("No memberships found:", debugInfo);

		return (
			<div className='flex min-h-screen items-center justify-center'>
				<div className='text-center max-w-md'>
					<h1 className='text-2xl font-bold'>Setup Error</h1>
					<p className='text-muted-foreground mt-2'>
						Your workspace was not set up properly. This can happen if you
						signed up before the system was fully configured.
					</p>
					<pre className='mt-4 p-2 bg-muted rounded text-xs text-left overflow-auto'>
						{JSON.stringify(debugInfo, null, 2)}
					</pre>
					<form action='/api/auth/signout' method='POST' className='mt-4'>
						<button
							type='submit'
							className='px-4 py-2 bg-primary text-primary-foreground rounded'
						>
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
