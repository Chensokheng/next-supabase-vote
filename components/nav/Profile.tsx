import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { GearIcon, PlusIcon } from "@radix-ui/react-icons";

import Image from "next/image";
import VoteSheet from "../VoteSheet";
import Logout from "./Logout";
import { User } from "@supabase/supabase-js";

export default function Profile({ user }: { user: User | undefined }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Image
					src={user?.user_metadata?.avatar_url}
					width={50}
					height={50}
					alt={user?.user_metadata?.user_name}
					className=" rounded-full ring-green-500 ring cursor-pointer hover:scale-125 transition-all"
				/>
			</PopoverTrigger>
			<PopoverContent className="w-72 space-y-5 divide-y">
				<Button
					className="w-full flex items-center justify-between "
					variant="ghost"
				>
					Profile <GearIcon />
				</Button>

				<VoteSheet
					trigger={
						<Button
							className="w-full flex items-center justify-between "
							variant="ghost"
						>
							Create <PlusIcon />
						</Button>
					}
				/>

				<Logout />
			</PopoverContent>
		</Popover>
	);
}
