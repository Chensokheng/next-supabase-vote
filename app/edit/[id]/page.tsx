import EditVoteForm from "@/app/edit/[id]/EditVoteForm";
import { getVoteById } from "@/lib/actions/vote";
import { IVote } from "@/lib/types";
import { redirect } from "next/navigation";
import React from "react";

export default async function page({ params }: { params: { id: string } }) {
	const { data: vote } = await getVoteById(params.id);

	if (!vote) {
		return redirect("/404");
	}

	return (
		<div className="max-w-5xl mx-auto">
			<EditVoteForm vote={vote as IVote} />
		</div>
	);
}
