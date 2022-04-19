import Link from 'next/link';
import { useEffect, useState } from 'react';

const Footer = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	useEffect(() => {
		const isLoggedIn = JSON.parse(
			window.localStorage.getItem('isLoggedIn') ?? 'false'
		);
		setLoggedIn(isLoggedIn);
	});
	return (
		<footer
			style={{
				width: '95%',
				margin: '0 auto',
				display: 'flex',
				justifyContent: 'flex-end',
				position: 'fixed',
				bottom: '1em',
			}}
		>
			{loggedIn ? (
				<Link href="/admin/orders" passHref>
					pantanir
				</Link>
			) : (
				<Link href="/admin" passHref>
					innskráning
				</Link>
			)}
		</footer>
	);
};

export default Footer;
