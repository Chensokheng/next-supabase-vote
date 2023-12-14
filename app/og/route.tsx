import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.
export const runtime = "edge";

const regularFont = fetch(
	new URL("../../public/SpaceGrotesk-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const boldFont = fetch(
	new URL("../../public/SpaceGrotesk-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(request: Request) {
	try {
		const [regularFontData, boldFontData] = await Promise.all([
			regularFont,
			boldFont,
		]);

		const { searchParams } = new URL(request.url);

		const title = searchParams.get("title");
		const author = searchParams.get("author");
		const author_url = searchParams.get("author_url");

		return new ImageResponse(
			(
				// Modified based on https://tailwindui.com/components/marketing/sections/cta-sections
				<div
					style={{
						height: "100%",
						width: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#021528",
						border: "4px solid #C792EF",
					}}
				>
					<div tw="flex flex-col  w-full py-12 px-4 p-8 ">
						<h1
							tw="font-bold"
							style={{
								marginBottom: "100",
								fontSize: "80",
								color: "#C792EF",
							}}
						>
							{title}
						</h1>
						<div
							tw="flex flex-row  item-center w-full gap-3"
							style={{
								alignItems: "center",
								gap: 20,
							}}
						>
							{/* eslint-disable-next-line */}
							<img
								src={author_url!}
								width={100}
								height={100}
								tw="rounded-full border-4 border-green-500"
							/>
							<div tw="flex flex-col">
								<h1 tw="text-white m-0 text-red-400">
									{author}
								</h1>
								<p tw="text-white m-0 text-blue-500 text-2xl mt-3">
									https://next-supabase-vote.vercel.app/
								</p>
							</div>
						</div>
					</div>
				</div>
			),
			{
				width: 1200,
				height: 630,
				fonts: [
					{
						name: "Inter",
						data: regularFontData,
						weight: 400,
					},
					{
						name: "Inter",
						data: boldFontData,
						weight: 700,
					},
				],
			}
		);
	} catch (e: any) {
		console.log(`${e.message}`);
		return new Response(`Failed to generate the image`, {
			status: 500,
		});
	}
}
