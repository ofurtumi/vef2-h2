import type { NextPage } from 'next';
import Head from 'next/head';
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
					<img
						src="https://images.unsplash.com/photo-1650283414400-d6d0ff4e01f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
						alt=""
					/>
				</div>
			</div>
		</>
	);
};

export default Home;
