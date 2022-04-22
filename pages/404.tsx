import styles from '../styles/main.module.css';

const Custom404 = () => {
	return (
		<div className={styles.root}>
			<div>
				<h1>Oops, something went wrong</h1>
				<p>
					<a href="..">Go back to front page</a>
				</p>
			</div>
		</div>
	);
}

export default Custom404;