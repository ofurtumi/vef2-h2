import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import styles from '../styles/main.module.css';

const OrderSuccess = (props: { id: any }) => {
	return (
		<div className={styles.root}>
			<div className={styles.suite}>
				<h1>Pöntun tókst</h1>
				<h2>
					<Link href={'/'}>Aftur heim</Link>
				</h2>
			</div>
		</div>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const orderData = context.req.cookies['order'];
  const id = orderData;
	console.log('id --> ', id);
	// ? hérna á að koma websocket dæmi til að sækja upplýsingar um staka pöntun
	// const rawOrder = await fetch('https://vef2-2022-h1-synilausn.herokuapp.com/orders/'+id)
	// console.log('rawOrder --> ', rawOrder)
	return { props: { id } };
}

export default OrderSuccess;
