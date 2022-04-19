import Link from 'next/link';
import { useEffect, useState } from 'react';

const Header = () => {
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
			<Link href="/cart" passHref>
				Karfa
			</Link>
		</nav>
	);
};

export default Header;
