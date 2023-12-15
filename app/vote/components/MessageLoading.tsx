import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function MessageLoading() {
	return (
		<div className="space-y-5 pb-10">
			{[1, 2, 4, 5].map((value) => {
				return (
					<div className="flex items-center gap-2" key={value}>
						<Skeleton className=" h-14 w-14 rounded-full" />
						<div className="space-y-3">
							<Skeleton className="h-3 w-20 rounded-full" />
							<Skeleton className="h-3 w-20 rounded-full" />
							<Skeleton className="h-3 w-44 sm:w-80 rounded-full" />
						</div>
					</div>
				);
			})}
		</div>
	);
}
