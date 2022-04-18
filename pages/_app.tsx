import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { CookiesProvider } from 'react-cookie';
import Header from './header';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<CookiesProvider>
			<Header />
			<Component {...pageProps} />
		</CookiesProvider>
	);
}

export default MyApp;
