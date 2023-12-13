import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
	return (
		<div className=" border rounded-md">
			<TableDemo />
		</div>
	);
}

export function TableDemo() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						<Skeleton className=" h-5 w-12 rounded-md" />
					</TableHead>
					<TableHead>
						<Skeleton className=" h-5 w-12 rounded-md" />
					</TableHead>
					<TableHead>
						<Skeleton className=" h-5 w-12 rounded-md" />
					</TableHead>
					<TableHead>
						<Skeleton className=" h-5 w-12 rounded-md" />
					</TableHead>
					<TableHead>
						<Skeleton className=" h-5 w-12 rounded-md" />
					</TableHead>
					<TableHead className="w-[100px]"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{[1, 2, 3, 4].map((value) => {
					return (
						<TableRow key={value}>
							<TableCell className="font-medium">
								<Skeleton className=" h-5 w-5 rounded-md" />
							</TableCell>
							<TableCell className="font-medium">
								<Skeleton className=" h-5  w-24 rounded-md" />
							</TableCell>
							<TableCell className="font-medium">
								<Skeleton className=" h-5  w-24 rounded-lg" />
							</TableCell>
							<TableCell className="font-medium">
								<Skeleton className=" h-5  w-24 rounded-md" />
							</TableCell>
							<TableCell className="font-medium">
								<Skeleton className=" h-5  w-24 rounded-md" />
							</TableCell>
							<TableCell className="font-medium flex items-center gap-1">
								<Skeleton className=" h-2  w-2 rounded-full" />
								<Skeleton className=" h-2  w-2 rounded-full" />
								<Skeleton className=" h-2  w-2 rounded-full" />
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
