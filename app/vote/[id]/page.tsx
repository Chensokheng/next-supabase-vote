import React from "react";
import Vote from "../components/Vote";
import Chat from "../components/Chat";
import Pressence from "../components/Pressence";

export default async function Page({ params }: { params: { id: string } }) {
	return (
		<div className="w-full flex items-center justify-center  min-h-70vh">
			<div className="w-full space-y-20">
				<Pressence />
				<div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-10 ">
					<Vote />
					<Chat />
				</div>
			</div>
		</div>
	);
}
