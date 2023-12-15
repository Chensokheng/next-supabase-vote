export type IVotes =
	| {
			created_at: string;
			created_by: string;
			end_date: string;
			id: string;
			public: boolean;
			title: string;
			users: {
				avatar_url: string | null;
				created_at: string;
				id: string;
				user_name: string | null;
			} | null;
	  }[]
	| null;

export type IVoteLog = {
	vote_id: string;
	user_id: string;
	id: string;
	option: string;
	created_at: string;
};

export type IVote = {
	created_at: string;
	created_by: string;
	end_date: string;
	id: string;
	public: boolean;
	title: string;
};
