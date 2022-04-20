import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import styles from '../../styles/main.module.css';

const FoodItem = (props: { item: any }) => {
	return (
		<div className={styles.root}>
			<div className={styles.mansion}>
                <div className={styles.room}>
				<h1>{props.item.title}</h1>
				<h2>{props.item.price}</h2>
				<p>{props.item.description}</p>
				<img src={props.item.image} alt="" />
				<Link href={'/menu'}>
					<a style={{textAlign:'center',marginTop:'0.5em'}}>
						<h3>Aftur til baka</h3>
					</a>
				</Link>
                </div>
			</div>
		</div>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const params = context.params;

	const data = await fetch(
		'https://vef2-2022-h1-synilausn.herokuapp.com/menu/' + params?.id
	);
	const item = await data.json();

	return { props: { item } };
}

export default FoodItem;
