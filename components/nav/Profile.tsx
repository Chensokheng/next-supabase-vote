import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { GearIcon, PlusIcon } from "@radix-ui/react-icons";

import Image from "next/image";
import Logout from "./Logout";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function Profile({ user }: { user: User | undefined }) {
	return (
		<>
			<Popover>
				<PopoverTrigger asChild id="close-popover">
					<Image
						src={user?.user_metadata?.avatar_url}
						width={50}
						height={50}
						alt={user?.user_metadata?.user_name}
						className=" rounded-full ring-green-500 ring cursor-pointer hover:scale-125 transition-all animate-fade"
					/>
				</PopoverTrigger>
				<PopoverContent className="w-72 space-y-5 divide-y" align="end">
					<Link href={"/profile?id=" + user?.id}>
						<Button
							className="w-full flex items-center justify-between rounded-none "
							variant="ghost"
							onClick={() => {
								document
									.getElementById("close-popover")
									?.click();
							}}
						>
							Profile <GearIcon />
						</Button>
					</Link>
					<Link href="/create">
						<Button
							className="w-full flex items-center justify-between rounded-none "
							variant="ghost"
							onClick={() => {
								document
									.getElementById("close-popover")
									?.click();
							}}
						>
							Create <PlusIcon />
						</Button>
					</Link>

					<Logout />
				</PopoverContent>
			</Popover>
		</>
	);
}
