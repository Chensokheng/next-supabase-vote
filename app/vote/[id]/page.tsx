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
			url: "https://dynamic-og-image-generator.vercel.app",
			siteName: "Daily Blog",
			images: `https://dynamic-og-image-generator.vercel.app/api/generate?title=${data?.title}&author=${data?.users?.user_name}&websiteUrl=${url}&avatar=${data?.users?.avatar_url}&theme=nightOwl`,
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
						<Suspense fallback={<VoteLoading />}>
							<VoteFetcher voteId={params.id} />
						</Suspense>
						<Chat />
					</div>
				</div>
			</div>
			<CloseForm />
		</>
	);
}
