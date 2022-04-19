import { Menu } from '../types';
import styles from '../styles/main.module.css';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { GetServerSidePropsContext } from 'next';

const Menu = (props: { menu: Menu; orderArray: Array<number> }) => {
	const [cart, setCart] = useState<number[]>(props.orderArray);
  const [cookie, setCookie] = useCookies(['cart'])
  // console.log('endalaust')

	useEffect(() => {
     setCookie('cart', JSON.stringify(cart), {sameSite: true})
	},[cart]);

	return (
		<div className={styles.root}>
			<div className={styles.prison}>
				{props.menu.items.map((item, i) => {
					return (
						<div key={i} className={styles.cell}>
							<h1>{item.title}</h1>
							<p>{item.description}</p>
							<h2>{item.price}</h2>
							<img src={item.image} alt="" />
							<h3>{cart[i]}</h3>
							<button
								onClick={() => {
									const cartCopy = [...cart];
									cartCopy[i] += 1;
									setCart(cartCopy);
								}}
							>
								Bæta í körfu
							</button>
							<button
								onClick={() => {
									const cartCopy = [...cart];
									if (cartCopy[i] > 0) cartCopy[i] -= 1;
									setCart(cartCopy);
								}}
							>
								Fjarlægja úr körfu
							</button>
						</div>
					);
				})}
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

	let orderArray = Array<number>(menu.items.length);
	for (let i = 0; i < orderArray.length; i++) {
		orderArray[i] = 0;
	}
  try {
    if (context.req.cookies['cart']) {
      orderArray = JSON.parse(context.req.cookies['cart'])
    }
  } catch (error) {
    console.error("asdf",error)
  }

	return {
		props: { menu, orderArray }, // will be passed to the page component as props
	};
}

export default Menu;
