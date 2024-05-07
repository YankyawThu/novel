import '@/styles/globals.css'
import {NextIntlProvider} from 'next-intl';
import { SessionProvider } from "next-auth/react"
import NextNProgress from "nextjs-progressbar";
import Script from 'next/script'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<>
			<SessionProvider session={session}>
				<NextIntlProvider
					formats={{
						dateTime: {
						short: {
							day: 'numeric',
							month: 'short',
							year: 'numeric',
						},
						},
					}}
					messages={pageProps.messages}
				>
					<NextNProgress />
					<Component {...pageProps} />
				</NextIntlProvider>
			</SessionProvider>
			
			{/* Google tag (gtag.js) */}
			<Script
				src="https://www.googletagmanager.com/gtag/js?id=G-JT9Z53C8V4"
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){window.dataLayer.push(arguments);}
					gtag('js', new Date());

					gtag('config', 'G-JT9Z53C8V4');
				`}
			</Script>
		</>
	)
}
