import Link from 'next/link';
import { useEffect, useState } from 'react';

const Footer = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	useEffect(() => {
		const isLoggedIn = JSON.parse(
			window.localStorage.getItem('isLoggedIn') ?? 'false'
		);
		setLoggedIn(isLoggedIn);
	},[]);
	const JC = loggedIn ? 'space-between' : 'flex-end';
	return (
		<footer
			style={{
				width: '95%',
				margin: '0 auto',
				display: 'flex',
				justifyContent: JC,
				position: 'fixed',
				bottom: '1em',
			}}
		>
			{loggedIn ? <p style={{ margin: '0 1em' }}>Innskráð/ur</p> : null}

			{loggedIn ? (
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						gap: '2em',
					}}
				>
					<Link href="/admin/logout" passHref>
						útskráning
					</Link>
					<Link href="/admin/orders" passHref>
						pantanir
					</Link>
				</div>
			) : (
				<Link href="/admin/login" passHref>
					innskráning
				</Link>
			)}
		</footer>
	);
};

export default Footer;
