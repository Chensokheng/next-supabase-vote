import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Page() {
	const votes = [
		{
			id: 1,
			title: "Vote for Best Javascript Framework",
			created_at: new Date().toDateString(),
			emoji: "👋",
			author: {
				image_url:
					"https://avatars.githubusercontent.com/u/45727563?v=4",
				name: "Meak",
			},
		},
		{
			id: 2,

			title: "Vote for Best Programing Language",
			created_at: new Date().toDateString(),
			emoji: "🤔",
			author: {
				image_url: "https://avatars.githubusercontent.com/u/569861?v=4",
				name: "sachee",
			},
		},
		{
			id: 3,

			title: "Vote for Best Emoji",
			created_at: new Date().toDateString(),
			emoji: "🤖",

			author: {
				image_url:
					" https://avatars.githubusercontent.com/u/919717?v=4",
				name: "filiph",
			},
		},
		{
			id: 4,
			title: "Vote for Best Social Media",
			created_at: new Date().toDateString(),
			emoji: "📣",

			author: {
				image_url:
					"https://avatars.githubusercontent.com/u/52232579?v=4",
				name: "sokheng",
			},
		},
	];

	const rings = [
		{
			ring: "ring-green-500",
			bg: "bg-green-500",
		},
		{
			ring: "ring-indigo-500",
			bg: "bg-indigo-500",
		},
		{
			ring: "ring-pink-500",
			bg: "bg-pink-500",
		},
		{
			ring: "ring-yellow-500",
			bg: "bg-yellow-500",
		},

		{
			ring: "ring-blue-500",
			bg: "bg-blue-500",
		},
	];

	return (
		<div className=" w-full mx-auto py-10 px-10 md:p-5 grid  grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-flow-dense gap-y-20 gap-10 ">
			{votes.map(({ title, created_at, emoji, author, id }, index) => {
				const { ring, bg } =
					rings[Math.floor(Math.random() * rings.length)];
				return (
					<Link
						href={"/vote/" + id}
						key={index}
						className=" w-full md:w-96  "
					>
						<div className="relative group">
							<div className=" border border-zinc-600 rounded-md p-5 space-y-3 bg-zinc-800 group-hover:translate-x-3 group-hover:translate-y-3 transition-all relative">
								<div className="flex items-center gap-2">
									<Image
										src={author.image_url}
										alt={author.name}
										width={40}
										height={40}
										className={`rounded-full ring-2 ${ring}`}
									/>
									<div>
										<h1 className=" text-base">
											{author.name}
										</h1>
									</div>
								</div>

								<h1 className="text-2xl font-medium">
									{title}
								</h1>
								<p className="tex-sm text-gray-400">
									Until {created_at}
								</p>
								<span className=" absolute -top-8 right-0 text-3xl">
									{emoji}
								</span>
							</div>
							<div
								className={` -z-10 absolute top-0 right-0 translate-x-3 translate-y-3 w-full h-full ring-1  rounded-md ${ring} ${bg} bg-opacity-10`}
							></div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
