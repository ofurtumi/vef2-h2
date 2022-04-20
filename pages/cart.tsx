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

const Cart = (props: {
	menu: Menu;
	cookie: Array<{ id: number; quantity: number }>;
}) => {
	const router = useRouter();
	const [name, setName] = useState('no-name');
	const [cart, setCart] = useState(props.cookie);
	const [cookie, setCookie] = useCookies(['cart']);
	const [order, setOrder] = useCookies(['order']);

	// const sum = cart.reduce((acc: number, item: number) => acc + item, 0);

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
			if (cart[i] && cart[i].quantity > 0) {
				const orderItem = await JSON.stringify({
					product: item.id,
					quantity: cart[i].quantity,
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
			name: name,
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
		if (order.ok) {
			const orderJSON = await order.json();
			setCookie('cart', '', { maxAge: -1 });
			setOrder('order', orderJSON.id);
			router.push('/cartSuccess');
		}
	}
	return (
		<div className={styles.root}>
			<h1>Pöntun:</h1>
			<div className={styles.prison}>
				{cart.map((item, i) => {
					if (item.quantity > 0) {
						const index = props.menu.items.findIndex(
							(x) => x.id === item.id
						);
						const food = props.menu.items[index];
						return (
							<div className={styles.cell} key={i}>
								<a
									style={{ width: '100%' }}
									href={'/food/' + item.id}
								>
									<span>
										<h1>{food.title}</h1>
										<h2>{food.price}kr</h2>
									</span>
								</a>
								<span>
									<h3>{' x' + item.quantity}</h3>
									<p>
										Heildarverð:{' '}
										{item.quantity * food.price}kr
									</p>
								</span>
								<img src={food.image} alt="" />
							</div>
						);
					}
				})}
				{/* <h2 style={{gridColumn:'1'}}>{sum}</h2> */}
				<input
					type="text"
					placeholder="Nafn fyrir pöntun"
					style={{ gridColumn: 'span 2' }}
					onChange={(event) => {
						setName(event.target.value);
						// console.log('event --> ', event.target.value)
					}}
				/>
				<button style={{ gridColumn: 'span 2' }} onClick={makeOrder}>
					Staðfesta pöntun
				</button>
			</div>
		</div>
	);
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
	const rawMenu = await fetch(
		'https://vef2-2022-h1-synilausn.herokuapp.com/menu?offset=0&limit=100'
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
