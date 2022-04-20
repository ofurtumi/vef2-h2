import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Order, Orders, User } from '../../types';
import styles from '../../styles/main.module.css';
import Link from 'next/link';

const Orders = (props: { user: User; orders: Orders }) => {
	const [orders, setOrders] = useState<Order[]>([]);
	const router = useRouter();
	useEffect(() => {
		if (!props.user) {
			window.localStorage.setItem('isLoggedIn', 'false');
			router.push('/');
		} else setOrders(props.orders.items);
	});

	const rOrders: Array<Order> = orders.slice(0).reverse();

	return (
		<div className={styles.root}>
			<div className={styles.prison}>
				{rOrders.map((order, i) => {
					return (
						<Link key={i} href={'/orders/' + order.id}>
							<div className={styles.cell}>
								<h2 style={{ margin: '0' }}>{i + 1}</h2>
								<p>Order id: {order.id}</p>
								<p>Order status: {order.current_state}</p>
								<p>Order created: {order.created}</p>
								<p>
									Order updated: {order.current_state_created}
								</p>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	let user = null;
	let res = null;
	try {
		user = JSON.parse(context.req.cookies['user']);
		const endpoint = `https://vef2-2022-h1-synilausn.herokuapp.com/orders?offset=0&limit=100`;
		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + user.token,
			},
		};
		res = await fetch(endpoint, options);
	} catch (error) {}

	let orders = null;
	if (res && res.ok) {
		orders = await res.json();
	}

	return { props: { user, orders } };
}

export default Orders;
