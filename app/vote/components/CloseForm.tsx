"use client";
import { useEffect } from "react";

export default function CloseForm() {
	useEffect(() => {
		document.getElementById("close-sheet")?.click();
	}, []);

	return null;
}
