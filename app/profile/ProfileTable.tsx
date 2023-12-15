"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { IVote } from "@/lib/types";
import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import { Link1Icon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import EditSheet from "./components/EditSheet";
import EditVoteForm from "./components/EditVoteForm";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";
import { createSupabaseBrower } from "@/lib/supabase/client";
import { updateVotePath } from "@/lib/actions/vote";

export default function ProfileTable({ data }: { data: IVote[] }) {
	const [votes, setVotes] = useState(data);
	const supabse = createSupabaseBrower();
	const [animationParent] = useAutoAnimate();

	const handleShare = async (id: string) => {
		toast.promise(
			navigator.clipboard.writeText(location.origin + "/vote/" + id),
			{
				loading: "Copying..",
				success: "Successfully copy link",
				error: (err) => "Failt to copy link " + err.toString(),
			}
		);
	};

	const toastDelete = async (id: string, title: string) => {
		const deletVote = async () => {
			const { error } = await supabse.from("vote").delete().eq("id", id);
			updateVotePath(id);

			if (error) {
				throw error.message;
			} else {
				setVotes((currentVote) =>
					currentVote.filter((vote) => vote.id !== id)
				);
			}
		};

		toast.promise(deletVote(), {
			loading: "deleting..",
			success: "Successfully delete vote " + title,
			error: (err) => "Failt to delete vote. " + err.toString(),
		});
	};

	const updateVote = (upateVote: IVote) => {
		setVotes((currentVotes) =>
			currentVotes.map((vote) => {
				if (vote.id === upateVote.id) {
					return upateVote;
				} else {
					return vote;
				}
			})
		);
	};

	return (
		<div className=" rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead>End At</TableHead>
						<TableHead className="w-[100px]"></TableHead>
					</TableRow>
				</TableHeader>

				<TableBody ref={animationParent}>
					{votes.map((vote) => (
						<TableRow key={vote.id}>
							<TableCell className="font-medium">
								{vote.title.length > 30
									? vote.title.slice(0, 30) + " ..."
									: vote.title}
							</TableCell>
							<TableCell className="font-medium">
								{vote.end_date > new Date().toISOString() ? (
									<Badge className=" bg-green-500">
										Active
									</Badge>
								) : (
									<Badge className=" bg-red-300">
										Expired
									</Badge>
								)}
							</TableCell>
							<TableCell>
								{new Date(vote.created_at).toDateString()}
							</TableCell>
							<TableCell>
								{new Date(vote.end_date).toDateString()}
							</TableCell>
							<TableCell>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="ghost"
											className="h-8 w-8 p-0"
										>
											<span className="sr-only">
												Open menu
											</span>
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</PopoverTrigger>
									<PopoverContent
										align="end"
										className="w-[200px]"
									>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="ghost"
													className="flex items-center justify-between cursor-pointer w-full"
												>
													Delete <TrashIcon />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you absolutely sure?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be
														undone. This will
														permanently delete your
														account and remove your
														data from our servers.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>
														Cancel
													</AlertDialogCancel>
													<AlertDialogAction
														onClick={() =>
															toastDelete(
																vote.id,
																vote.title
															)
														}
													>
														Continue
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>

										<EditSheet
											trigger={
												<Button
													variant="ghost"
													className="flex items-center justify-between cursor-pointer w-full"
												>
													Edit <Pencil1Icon />
												</Button>
											}
											editForm={
												<EditVoteForm
													vote={vote}
													handleUpdateVote={
														updateVote
													}
												/>
											}
										/>

										<Button
											variant="ghost"
											className="flex items-center justify-between cursor-pointer w-full"
											onClick={() => handleShare(vote.id)}
										>
											Share <Link1Icon />
										</Button>
									</PopoverContent>
								</Popover>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
