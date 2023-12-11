import React from "react";
import Vote from "../components/Vote";
import Chat from "../components/Chat";
import Pressence from "../components/Pressence";
import CloseForm from "../components/CloseForm";

import createSupabaseServer from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { sortObject } from "@/lib/utils";

export default async function Page({ params }: { params: { id: string } }) {
	const supabase = await createSupabaseServer();
	const { data } = await supabase.auth.getUser();

	if (!data.user) {
		return redirect("/");
	}

	const { data: vote } = await supabase
		.from("vote")
		.select("*,vote_options(*),vote_log(*)")
		.eq("id", params.id)
		.eq("vote_log.user_id", data.user.id)
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
						<Vote
							id={vote.id}
							options={sortObject(
								vote?.vote_options?.options as {
									[key: string]: number;
								}
							)}
							vote_log={vote.vote_log[0]}
							is_expired={new Date(vote?.end_date!) < new Date()}
						/>
						<Chat />
					</div>
				</div>
			</div>
			<CloseForm />
		</>
	);
}
