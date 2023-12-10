"use server";

import createSupabaseServer from "../supabase/server";

export async function listVotes() {
	const supabase = await createSupabaseServer();

	return supabase.from("vote").select("*,users(*)");
}
