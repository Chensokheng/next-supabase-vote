import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";
import Navbar from "@/components/nav/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import createSupabaseServer from "@/lib/supabase/server";
import InitUser from "@/components/store/InitUser";
import QueryProvider from "@/components/QueryProvider";

const inter = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL("https://next-supabase-vote.vercel.app/"),

	title: {
		template: "%s | Daily Vote",
		default: "Daily Vote",
	},
	authors: {
		name: "chensokheng",
	},

	description:
		"Cast your vote now and see live updates on the poll results, powered by the real-time capabilities of Supabase database integration in our web app",
	openGraph: {
		title: "Daily Vote",
		description:
			"Cast your vote now and see live updates on the poll results, powered by the real-time capabilities of Supabase database integration in our web app.",
		url: "https://next-supabase-vote.vercel.app/",
		siteName: "Daily Vote",
		images: "/og.png",
		type: "website",
	},
	keywords: ["daily web coding", "chensokheng", "dailywebcoding"],
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// TODO: removet this
	const supabase = await createSupabaseServer();
	const { data } = await supabase.auth.getUser();

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.className} bg-[#09090B] text-gray-200 antialiased  py-10`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<QueryProvider>
						<main className="flex flex-col max-w-7xl mx-auto min-h-screen space-y-10 p-5">
							<Navbar user={data.user} />
							<div className="w-full flex-1 ">{children}</div>
							<Footer />
						</main>
					</QueryProvider>

					<Toaster position="top-center" reverseOrder={false} />
				</ThemeProvider>
				<InitUser user={data.user} />
			</body>
		</html>
	);
}
