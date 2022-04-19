import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Menu } from '../types';
import styles from '../styles/main.module.css';

type Cart = {
	id: number;
	created: string;
};

const Cart = (props: { menu: Menu }) => {
	const router = useRouter();
	const [cart, setCart] = useState([]);

	useEffect(() => {
		console.log('test');
		if (cart.length === 0)
			setCart(JSON.parse(window.localStorage.getItem('cart') ?? ''));
	});

	const sum = cart.reduce((acc: number, item: number) => acc + item, 0);

	async function makeOrder() {
		// * býr til körfu til, eftir parse er það Cart hlutur með id
		let cartData = await fetch(
			'https://vef2-2022-h1-synilausn.herokuapp.com/cart',
			{
				method: 'POST',
			}
		);
		const cartJson: Cart = await cartData.json();

		// * bætir í körfu öllu draslinu sem er til
		props.menu.items.map(async (item, i) => {
			if (cart[i] && cart[i] > 0) {
				const orderItem = await JSON.stringify({
					product: item.id,
					quantity: cart[i],
				});
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: orderItem,
				};
				await fetch(
					`https://vef2-2022-h1-synilausn.herokuapp.com/cart/${cartJson.id}`,
					options
				);
			}
		});

		// * býr til pöntun útfrá körfunni
		const body = await JSON.stringify({
			cart: cartJson.id,
			name: 'Tumi - test',
		});
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: body,
		};
		const order = await fetch(
			'https://vef2-2022-h1-synilausn.herokuapp.com/cart',
			options
		);
		if (order.ok) {
			const orderJSON = await order.json();
			window.localStorage.setItem('orderId', orderJSON.id);
			router.push('/cartSuccess');
		}
	}
	return (
		<div className={styles.root}>
			<div className={styles.prison}>
				{props.menu.items.map((item, i) => {
					if (cart[i] && cart[i] > 0) {
						return (
							<div key={i} className={styles.suite}>
								<p>{item.title}</p>
								<h3>{cart[i]}</h3>
							</div>
						);
					}
				})}
				<h2>{sum}</h2>
			</div>
			<button onClick={makeOrder}>Staðfesta pöntun</button>
		</div>
	);
};
export async function getServerSideProps() {
	const rawMenu = await fetch(
		'https://vef2-2022-h1-synilausn.herokuapp.com/menu'
	);
	let menu = null;
	if (rawMenu.ok) menu = await rawMenu.json();

	return {
		props: { menu }, // will be passed to the page component as props
	};
}

export default Cart;