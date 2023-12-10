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
