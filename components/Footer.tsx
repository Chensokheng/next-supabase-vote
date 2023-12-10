import React from "react";
import {
	GitHubLogoIcon,
	DiscIcon,
	LinkedInLogoIcon,
	DiscordLogoIcon,
} from "@radix-ui/react-icons";
export default function Footer() {
	return (
		<footer className=" border-t-[0.5px] py-10 flex items-center justify-center flex-col gap-5">
			<div className="flex items-center gap-2">
				<GitHubLogoIcon className="w-5 h-5" />
				<LinkedInLogoIcon className="w-5 h-5" />
				<DiscordLogoIcon className="w-5 h-5" />
			</div>
			<h1 className="text-sm">
				&copy; 2023 Chensokheng.All right reserved
			</h1>
		</footer>
	);
}
