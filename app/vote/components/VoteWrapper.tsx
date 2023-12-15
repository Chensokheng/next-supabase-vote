"use client";
import AuthComponent from "@/app/auth/components/AuthComponent";
import React from "react";
import Vote from "./Vote";
import Chat from "./Chat";
import { useUser } from "@/lib/hook";

export default function VoteWrapper({ id }: { id: string }) {
	const { isFetching, data } = useUser();
	if (isFetching) {
		return <div className="h-96"></div>;
	}

	if (!data?.data.user?.id) {
		return <AuthComponent />;
	}

	return (
		<>
			<div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-10 ">
				<Vote id={id} />
				<Chat />
			</div>
		</>
	);
}
