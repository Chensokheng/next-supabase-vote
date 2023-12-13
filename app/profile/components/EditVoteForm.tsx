"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { CalendarIcon, TrashIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";

import { cn, nextWeek } from "@/lib/utils";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { IVote } from "@/lib/types";
import { createSupabaseBrower } from "@/lib/supabase/client";

const FormSchema = z.object({
	title: z
		.string()
		.min(5, { message: "Title has a minimum characters of 5" }),
	is_unlist: z.boolean().default(false),
	end_date: z.date(),
});

export default function EditVoteForm({
	vote,
	handleUpdateVote,
}: {
	vote: IVote;
	handleUpdateVote: (vote: IVote) => void;
}) {
	const supabase = createSupabaseBrower();

	const form = useForm<z.infer<typeof FormSchema>>({
		mode: "onSubmit",
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: vote.title,
			is_unlist: vote.is_unlist,
			end_date: new Date(vote.end_date),
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const updateVote = async () => {
			const { error } = await supabase
				.from("vote")
				.update({
					is_unlist: data.is_unlist,
					title: data.title,
					end_date: data.end_date.toISOString(),
				})
				.eq("id", vote.id);
			if (error?.message) {
				throw error.message;
			} else {
				handleUpdateVote({
					...vote,
					...data,
					end_date: data.end_date.toISOString(),
				});
				document.getElementById("close-sheet")?.click();
			}
		};

		toast.promise(updateVote(), {
			loading: "update...",
			success: "Successfully update",
			error: (err) => "Fail to update vote. " + err.toString(),
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="is_unlist"
					render={({ field }) => (
						<FormItem className=" space-x-2">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel className="font-normal text-lg">
								{"unlist (optional)"}
							</FormLabel>
							<FormDescription>
								If checked, it will not shown to public. But can
								still share this with as a private link
							</FormDescription>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									placeholder="vote for best of... "
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="end_date"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>End date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"w-full pl-3 text-left font-normal",
												!field.value &&
													"text-muted-foreground"
											)}
										>
											{field.value ? (
												format(field.value, "PPP")
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent
									className="w-full p-0"
									align="start"
								>
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) =>
											date > nextWeek() ||
											date < new Date()
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>

							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full"
					disabled={!form.formState.isValid}
				>
					update
				</Button>
			</form>
		</Form>
	);
}
