import React from "react";
import ProfileTable from "./ProfileTable";
import createSupabaseServer from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { IVote } from "@/lib/types";

export default async function page() {
	const supabase = await createSupabaseServer();

	const { data: user } = await supabase.auth.getUser();

	if (!user) {
		return redirect("/");
	}

	const { data } = await supabase
		.from("vote")
		.select("*")
		.eq("created_by", user.user?.id!)
		.order("created_at", { ascending: false });

	return <ProfileTable data={data as IVote[]} userId={user.user?.id!} />;
}
