import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function VoteLoading() {
	return (
		<div className=" space-y-5">
			<div>
				{["w-52", "w-48", "w-64"].map((value, index) => {
					return (
						<div className="flex items-center gap-5" key={index}>
							<Skeleton className=" h-5 w-20" />
							<div className=" border-l border-zinc-600 py-3 ">
								<Skeleton
									className={`h-16 ${value} rounded-s-none`}
								/>
							</div>
						</div>
					);
				})}
			</div>

			<Skeleton className=" h-5 w-96" />
		</div>
	);
}
