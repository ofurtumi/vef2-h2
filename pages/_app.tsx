import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { CookiesProvider } from 'react-cookie';
import Header from './header';
import Footer from './footer';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<CookiesProvider>
			<Header />
			<Component {...pageProps}/>
			<Footer />
		</CookiesProvider>
	);
}

export default MyApp;
