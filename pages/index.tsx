import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/main.module.css';

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Forsíða</title>
			</Head>
			<div className={styles.root}>
				<div className={styles.home}>
					<h1>Veitingastaður :)</h1>
					<p>
						Lorem, ipsum dolor sit amet consectetur adipisicing
						elit. Vel voluptatibus eius, consequatur fugit esse ex
						quisquam suscipit velit quas aliquid libero repellendus
						repudiandae, expedita harum. Quae repellendus
						accusantium aliquam voluptatibus?
					</p>
				</div>
			</div>
		</>
	);
};

export default Home;
