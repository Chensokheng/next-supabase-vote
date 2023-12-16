"use server";
import { unstable_noStore } from "next/cache";
import { Database } from "../types/supabase";
import { createClient } from "@supabase/supabase-js";

export default async function createSupabaseServerAdmin() {
	unstable_noStore();
	return createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SERVICE_ROLE!,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		}
	);
}
