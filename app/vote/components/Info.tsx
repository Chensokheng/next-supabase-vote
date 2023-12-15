"use client";
import { PersonIcon } from "@radix-ui/react-icons";
import React from "react";
import TimeCountDown from "./TimeCountDown";

export default function Info({
	title,
	endDate,
	id,
}: {
	title: string;
	endDate: string;
	id: string;
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
