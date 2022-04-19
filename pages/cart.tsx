import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Menu } from '../types';
import styles from '../styles/main.module.css';
import { GetServerSidePropsContext } from 'next';
import { useCookies } from 'react-cookie';

type Cart = {
	id: number;
	created: string;
};

const Cart = (props: { menu: Menu; cookie: Array<number> }) => {
	const router = useRouter();
	const [cart, setCart] = useState(props.cookie);
	const [cookie, setCookie] = useCookies(['cart']);
	const [order, setOrder] = useCookies(['order']);

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
				console.log('orderItem --> ', orderItem);
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
			'https://vef2-2022-h1-synilausn.herokuapp.com/orders',
			options
		);
        console.log('order --> ', order)
		if (order.ok) {
			const orderJSON = await order.json();
            console.log('orderJSON --> ', orderJSON)
			setCookie('cart', '', { maxAge: -1 });
			setOrder('order', orderJSON.id);
			router.push('/cartSuccess');
		}
	}
	return (
		<div className={styles.root}>
            <h1>Pöntun:</h1>
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
				<h2 style={{gridColumn:'1'}}>{sum}</h2>
				<button style={{gridColumn:'2'}} onClick={makeOrder}>Staðfesta pöntun</button>
			</div>
		</div>
	);
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
	const rawMenu = await fetch(
		'https://vef2-2022-h1-synilausn.herokuapp.com/menu'
	);
	let menu = null;
	if (rawMenu.ok) menu = await rawMenu.json();

	let cookie: Array<number> = [];
	try {
		if (context.req.cookies['cart'])
			cookie = JSON.parse(context.req.cookies['cart']);
	} catch (error) {}

	return {
		props: { menu, cookie }, // will be passed to the page component as props
	};
}

export default Cart;
