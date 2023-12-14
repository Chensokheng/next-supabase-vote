import React from "react";
import ProfileTable from "./ProfileTable";
import createSupabaseServer from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { IVote } from "@/lib/types";

export default async function page({
	searchParams,
}: {
	searchParams: {
		id: string;
	};
}) {
	const supabase = await createSupabaseServer();

	if (!searchParams?.id) {
		return redirect("/");
	}
	const { data, error } = await supabase
		.from("vote")
		.select("*")
		.eq("created_by", searchParams.id!)
		.order("created_at", { ascending: false });

	if (error || !data) {
		return redirect("/");
	}

	return <ProfileTable data={data as IVote[]} />;
}
