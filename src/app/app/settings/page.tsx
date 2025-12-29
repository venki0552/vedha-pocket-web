import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/app/settings-form";

export default async function SettingsPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	// Get user settings
	const { data: settings } = await supabase
		.from("user_settings")
		.select("*")
		.eq("user_id", user.id)
		.single();

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
				<p className='text-muted-foreground'>
					Manage your account and preferences
				</p>
			</div>

			<SettingsForm
				user={user}
				settings={settings || { theme: "system", llm_preference: "shared" }}
			/>
		</div>
	);
}
