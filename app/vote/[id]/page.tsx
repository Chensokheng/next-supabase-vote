import React from "react";
import CloseForm from "../components/CloseForm";
import { redirect } from "next/navigation";
import { createSupabaseBrower } from "@/lib/supabase/client";
import VoteWrapper from "../components/VoteWrapper";
import Info from "../components/Info";
import { DEFAUTL_DESCRIPTION } from "@/lib/constant";
import createSupabaseServer from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: { id: string } }) {
	const supabase = await createSupabaseServer();

	const { data } = await supabase
		.from("vote")
		.select("*,users(user_name,avatar_url)")
		.eq("id", params.id)
		.single();

	const url = "https://next-supabase-vote.vercel.app/";

	return {
		title: data?.title,
		authors: {
			name: data?.users?.user_name,
		},
		description: data?.description || DEFAUTL_DESCRIPTION,
		openGraph: {
			description: data?.description || DEFAUTL_DESCRIPTION,
			title: data?.title,
			url: url + "vote/" + data?.id,
			siteName: "Daily Vote",

			type: "website",
		},
		keywords: ["daily vote", data?.users?.user_name, "dailywebcoding"],
	};
}

export default async function Page({ params }: { params: { id: string } }) {
	const supabase = await createSupabaseServer();

	const { data: vote } = await supabase
		.from("vote")
		.select("*")
		.eq("id", params.id)
		.single();

	if (!vote) {
		return redirect("/404");
	}

	return (
		<>
			<div className="w-full flex items-center justify-center  min-h-70vh">
				<div className="w-full space-y-20">
					<Info title={vote?.title} endDate={vote.end_date} />
					<VoteWrapper id={params.id} />
				</div>
			</div>
			<CloseForm />
		</>
	);
}
