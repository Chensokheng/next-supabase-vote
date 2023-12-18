import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return request.cookies.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value,
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value,
						...options,
					});
				},
				remove(name: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value: "",
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value: "",
						...options,
					});
				},
			},
		}
	);

	const { data } = await supabase.auth.getSession();
	const { searchParams } = new URL(request.url);

	if (
		!data.session &&
		(pathname.startsWith("/create") ||
			pathname === "/profile" ||
			pathname.startsWith("/edit"))
	) {
		return NextResponse.redirect(new URL("/", request.url));
	} else if (pathname.startsWith("/profile")) {
		if (searchParams.get("id") !== data.session?.user.id) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	} else if (pathname.startsWith("/edit")) {
		if (searchParams.get("user") !== data.session?.user.id) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}
}

export const config = {
	matcher: ["/profile", "/create", "/edit/:path*", "/", "/vote/:path*"],
};
