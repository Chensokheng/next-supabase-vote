import {
	useQuery,
	keepPreviousData,
	useQueryClient,
	useInfiniteQuery,
} from "@tanstack/react-query";
import { createSupabaseBrower } from "../supabase/client";
import toast from "react-hot-toast";
import { getFromAndTo, sortObject } from "../utils";

export function useGetVote(id: string) {
	const supabase = createSupabaseBrower();

	return useQuery({
		queryKey: ["vote-" + id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("vote")
				.select("*,vote_options(*),vote_log(*)")
				.eq("id", id)
				.single();

			if (error) {
				toast.error("Fail to fetch vote. " + error.message);
			}
			const voteOptions = sortObject(
				data?.vote_options?.options as { [key: string]: number }
			);
			const totalVote = Object.values(voteOptions).reduce(
				(acc, value) => acc + value,
				0
			);

			return {
				voteOptions,
				totalVote,
				voteLog: data?.vote_log[0],
				isExpired: data?.end_date! < new Date().toISOString(),
			};
		},
		staleTime: Infinity,
	});
}

export function useUser() {
	const supabase = createSupabaseBrower();
	return useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const { data } = await supabase.auth.getSession();
			return { user: data.session?.user };
		},
		staleTime: Infinity,
	});
}

export function useChat(room: string) {
	const supabase = createSupabaseBrower();

	const fetchMessage = async ({ pageParam = 0 }) => {
		const { from, to } = getFromAndTo(pageParam);
		const { data } = await supabase
			.from("messages")
			.select("*,users(*)")
			.eq("vote_id", room)
			.order("created_at", { ascending: false })
			.range(from, to);

		return {
			messages: data || [],
			nextPage: data?.length! >= 4 ? pageParam + 1 : undefined,
		};
	};

	const result = useInfiniteQuery({
		initialPageParam: 0,
		getNextPageParam: (lastPage, pages) => lastPage.nextPage,
		queryKey: ["chat-" + room],
		queryFn: fetchMessage,
		placeholderData: keepPreviousData,
	});

	return result;
}
