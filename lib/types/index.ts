import { Json } from "./supabase";

export type IVotes =
	| {
			id: string;
			created_at: string;
			created_by: string;
			title: string;
			end_date: string;
			placeholder_options: object;
			users: {
				id: string;
				created_at: string;
				user_name: string;
				avatar_url: string;
			};
	  }[]
	| null;

export type IVoteLog = {
	vote_id: string;
	user_id: string;
	id: string;
	option: string;
	created_at: string;
} | null;
