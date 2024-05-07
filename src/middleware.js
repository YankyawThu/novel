import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

const authenticatedRoutes = [
	"/profile",
	"/payment"
]

const checkAuthRoutes = [
	"/login",
	"/register"
]

export default function middleware (request) {

	if (
		request.nextUrl.pathname.startsWith('/_next') ||
		request.nextUrl.pathname.includes('/api/') ||
		PUBLIC_FILE.test(request.nextUrl.pathname)
	) {
		return
	}

	const sessionTokenName = process.env.NODE_ENV == 'development' ? 'next-auth.session-token' : '__Secure-next-auth.session-token'
	
	const authToken = request.cookies.get(sessionTokenName);

	const locale = request.nextUrl.locale;
	
	if (locale === 'default') {
		const clocale = request.cookies.get('NEXT_LOCALE')?.value || 'en'
		
		return NextResponse.redirect(
			new URL(`/${clocale}${request.nextUrl.pathname}${request.nextUrl.search}`, request.url)
		)
	}
	
	if (typeof authToken == undefined || !authToken?.value) {
		if (authenticatedRoutes.some((prefix) => request.nextUrl.pathname.startsWith(prefix))) {
			return NextResponse.redirect(new URL(`/unauthorized`, request.url))
		}
	} else {
		if (checkAuthRoutes.some((prefix) => request.nextUrl.pathname.startsWith(prefix))) {
			return NextResponse.redirect(new URL(`/`, request.url))
		}
	}
}