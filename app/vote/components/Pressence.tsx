"use client";
import { PersonIcon } from "@radix-ui/react-icons";
import React from "react";
import TimeCountDown from "./TimeCountDown";

export default function Pressence() {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0, 0, 0, 0);
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 text-sm">
				<span className="h-5 w-5 rounded-full bg-green-500 animate-pulse"></span>
				<h1 className="flex items-center gap-2">
					5 <PersonIcon /> live on the site
				</h1>
			</div>
			<h1 className="text-3xl font-bold">
				Vote for Best Javascript Framework
			</h1>
			<TimeCountDown targetDate={tomorrow} />
		</div>
	);
}
