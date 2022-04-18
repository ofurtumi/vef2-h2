import Link from 'next/link';
import { useEffect, useState } from 'react';

const Header = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	useEffect(() => {
		const isLoggedIn = JSON.parse(
			window.localStorage.getItem('isLoggedIn') ?? 'false'
		);
		setLoggedIn(isLoggedIn);
	});
	return (
		<nav
			style={{
				display: 'flex',
				justifyContent: 'center',
				gap: '2em',
				margin: '0.5em',
			}}
		>
			<Link href="/" passHref>
				Heim
			</Link>
			<Link href="/menu" passHref>
				Matseðill
			</Link>
			{loggedIn ? (
				<Link href="/admin/orders" passHref>
					pantanir
				</Link>
			) : (
				<Link href="/admin" passHref>
					innskráning
				</Link>
			)}
		</nav>
	);
};

export default Header;
