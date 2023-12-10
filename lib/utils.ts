import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function nextWeek() {
	let currentDate = new Date();
	let nextWeekDate = new Date();
	nextWeekDate.setDate(currentDate.getDate() + 7);
	return nextWeekDate;
}
