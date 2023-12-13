import ListVote from "@/components/ListVote";
import { listActiveVotes, listExpiredVotes } from "@/lib/actions/vote";
import React, { Suspense } from "react";

export default async function Page() {
	return (
		<div className=" space-y-10">
			<h1 className="text-2xl font-bold text-green-500">
				Active Votes 📣
			</h1>
			<Suspense fallback={<h1>Loading...</h1>}>
				<ActiveVote />
			</Suspense>
			<h1 className="text-2xl font-bold text-red-400">Past Votes 🤖</h1>
			<Suspense fallback={<h1>Loading...</h1>}>
				<ExpiredVote />
			</Suspense>
		</div>
	);
}

const ActiveVote = async () => {
	const { data: votes } = await listActiveVotes();
	return <ListVote votes={votes} />;
};

const ExpiredVote = async () => {
	const { data: votes } = await listExpiredVotes();
	return <ListVote votes={votes} isExpire={true} />;
};
