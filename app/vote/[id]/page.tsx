import React, { Suspense } from "react";
import Chat from "../components/Chat";
import Pressence from "../components/Pressence";
import CloseForm from "../components/CloseForm";
import { redirect } from "next/navigation";
import { createSupabaseBrower } from "@/lib/supabase/client";
import VoteFetcher from "../components/VoteFetcher";
import VoteLoading from "../components/VoteLoading";

export async function generateStaticParams() {
	const supabase = createSupabaseBrower();

	const { data: votes } = await supabase
		.from("vote")
		.select("id")
		.eq("is_unlist", false)
		.filter("end_date", "gte", new Date().toISOString())
		.limit(10);

	return votes as any;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
	const supabase = createSupabaseBrower();

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
		openGraph: {
			title: data?.title,
			url: url + "vote/" + data?.id,
			siteName: "Daily Blog",
			images:
				url +
				`og?author=${data?.users?.user_name}&author_url=${data?.users?.avatar_url}&title=${data?.title}`,
			type: "website",
		},
		keywords: ["daily vote", data?.users?.user_name, "dailywebcoding"],
	};
}

export default async function Page({ params }: { params: { id: string } }) {
	const supabase = createSupabaseBrower();

	const { data: vote } = await supabase
		.from("vote")
		.select("*")
		.eq("id", params.id)
		.single();

	if (!vote) {
		return redirect("/");
	}

	return (
		<>
			<div className="w-full flex items-center justify-center  min-h-70vh">
				<div className="w-full space-y-20">
					<Pressence title={vote?.title} endDate={vote.end_date} />
					<div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-10 ">
						<Chat />
					</div>
				</div>
			</div>
			<CloseForm />
		</>
	);
}
