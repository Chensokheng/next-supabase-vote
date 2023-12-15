"use client";
import { TimerIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";

const TimeCountDown = ({ targetDate }: { targetDate: Date }) => {
	const calculateTimeLeft = () => {
		const now = new Date();
		const targetTime = targetDate.getTime();
		const difference = targetTime - now.getTime();

		if (difference < 0) {
			return { days: 0, hours: 0, minutes: 0, seconds: 0 };
		}

		const seconds = Math.floor(difference / 1000) % 60;
		const minutes = Math.floor(difference / (1000 * 60)) % 60;
		const hours = Math.floor(difference / (1000 * 60 * 60)) % 24;
		const days = Math.floor(difference / (1000 * 60 * 60 * 24));

		return { days, hours, minutes, seconds };
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

	useEffect(() => {
		const timer = setInterval(() => {
			const updatedTimeLeft = calculateTimeLeft();
			setTimeLeft(calculateTimeLeft);
			if (
				updatedTimeLeft.days === 0 &&
				updatedTimeLeft.hours === 0 &&
				updatedTimeLeft.minutes === 0 &&
				updatedTimeLeft.seconds === 0
			) {
				clearInterval(timer);
			}
		}, 1000);

		return () => clearInterval(timer);
		// eslint-disable-next-line
	}, []);

	return (
		<div
			className="text-3xl text-gray-400 flex items-center gap-2 "
			suppressHydrationWarning
		>
			<TimerIcon />
			<span suppressHydrationWarning>{timeLeft.days}D:</span>
			<span suppressHydrationWarning>{timeLeft.hours}H:</span>
			<span suppressHydrationWarning>{timeLeft.minutes}M:</span>
			<span suppressHydrationWarning>{timeLeft.seconds}S</span>
		</div>
	);
};

export default TimeCountDown;
