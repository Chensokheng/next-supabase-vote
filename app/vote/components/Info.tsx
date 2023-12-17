"use client";
import React from "react";
import dynamic from "next/dynamic";

const TimeCountDown = dynamic(() => import("./TimeCountDown"), { ssr: false });

export default function Info({
	title,
	endDate,
}: {
	title: string;
	endDate: string;
}) {
	const tomorrow = new Date(endDate);
	tomorrow.setHours(0, 0, 0, 0);

	return (
		<div className="space-y-3 w-full">
			<h1 className="text-3xl font-bold break-words">{title}</h1>
			<TimeCountDown targetDate={tomorrow} />
		</div>
	);
}
