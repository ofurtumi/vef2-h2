import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import styles from '../../styles/main.module.css';

const Logout = () => {
	const [user, setUser] = useCookies(['user']);
	useEffect(() => {
		setUser('user', '', { maxAge: -1, sameSite: true });
		window.localStorage.removeItem('user');
		window.localStorage.setItem('isLoggedIn', 'false');
	},[]);

	return (
		<div className={styles.root}>
			<div className={styles.home}>
				<h1>útskráning tókst, þú getur farið aftur til baka núna</h1>
				<Link href={'/'} passHref>
					<h2 style={{cursor:'pointer'}}>Heim</h2>
				</Link>
			</div>
		</div>
	);
};

export default Logout;
