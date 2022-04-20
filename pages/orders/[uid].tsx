import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Order } from '../../types';
import styles from '../../styles/main.module.css';

const Order = (props: { order: Order; auth: boolean }) => {
	const router = useRouter();
	useEffect(() => {
		const isLoggedIn = JSON.parse(
			window.localStorage.getItem('isLoggedIn') ?? 'false'
		);
		if (!isLoggedIn || !props.auth) router.push('/');
	});
	return (
		<div className={styles.root}>
			{props.order ? (
				<div className={styles.prison}>
					<div
						className={styles.cell}
						style={{ justifyContent: 'space-around' }}
					>
						<h1>Pöntun: {props.order.id}</h1>
						<h2>
							Staða:{' '}
							{
								props.order.status[
									props.order.status.length - 1
								].state
							}
						</h2>
						<h3>Búin til: {props.order.created}</h3>
						<h3>
							Síðast breytt:{' '}
							{
								props.order.status[
									props.order.status.length - 1
								].created
							}
						</h3>
						<button>Næsta staða pöntunar</button>
					</div>
					<div className={styles.prison}>
						{props.order.lines.map((line, i) => {
							return (
								<div className={styles.cell} key={i}>
									<span>
										<p>{line.title}</p>
										<p>Fjöldi: {line.quantity}</p>
									</span>
									<span>
										<p>Stakt verð: {line.price}</p>
										<p>Heildarverð: {line.total}</p>
									</span>
								</div>
							);
						})}
					</div>
				</div>
			) : (
				<p>Þessi pöntun virðist ekki vera til???</p>
			)}
		</div>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const user = context.req.cookies['user']
		? JSON.parse(context.req.cookies['user'])
		: null;

	if (user) {
		let uid = context.params?.uid;
		let rawOrder = null;
		const endpoint = `https://vef2-2022-h1-synilausn.herokuapp.com/orders/${uid}`;
		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + user.token,
			},
		};
		try {
			rawOrder = await fetch(endpoint, options);
		} catch (error) {
			console.error(error);
		}

		const order = rawOrder?.ok ? await rawOrder.json() : null;
		console.log('order --> ', order);
		return { props: { order: order, auth: true } };
	}
	return { props: { order: null, auth: false } };
}

export default Order;
