import { Menu } from "../types";
import styles from "../styles/main.module.css";
import { useState } from "react";
import { useRouter } from "next/router";

type Cart = {
  id: number;
  created: string;
};

const Menu = (props: { menu: Menu; orderArray: Array<number> }) => {
  // const [orders, setOrders] = useState(Array.apply(null, Array(props.menu.items.length)).map(function (x=0) { return x; }));
  const [orders, setOrders] = useState(props.orderArray);
  const sum = orders.reduce((acc, item) => acc + item, 0);
  const router = useRouter();

  async function makeOrder() {
    // * býr til körfu til, eftir parse er það Cart hlutur með id
    let cartData = await fetch(
      "https://vef2-2022-h1-synilausn.herokuapp.com/cart",
      {
        method: "POST",
      }
    );
    const cartJson: Cart = await cartData.json();

    // * bætir í körfu öllu draslinu sem er til
    props.menu.items.map(async (item, i) => {
      if (orders[i] && orders[i] > 0) {
        const orderItem = await JSON.stringify({
          product: item.id,
          quantity: orders[i],
        });
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
    const body = await JSON.stringify({ cart: cartJson.id, name: "Tumi - test"})
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    };
    const order = await fetch('https://vef2-2022-h1-synilausn.herokuapp.com/orders',options)
    if (order.ok) {
      const orderJSON = await order.json();
      window.localStorage.setItem('orderId',orderJSON.id)
      router.push('/orderSuccess')
    }
  }

  return (
    <div className={styles.prison}>
      {props.menu.items.map((item, i) => {
        return (
          <div key={i} className={styles.cell}>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
            <h2>{item.price}</h2>
            <h3>{orders[i]}</h3>
            <button
              onClick={() => {
                const ordersCopy = [...orders];
                ordersCopy[i] += 1;
                setOrders(ordersCopy);
              }}
            >
              Bæta í körfu
            </button>
          </div>
        );
      })}
      <div>
        {props.menu.items.map((item, i) => {
          if (orders[i] && orders[i] > 0) {
            return (
              <p key={i}>
                {item.title} #{orders[i]}
              </p>
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
    "https://vef2-2022-h1-synilausn.herokuapp.com/menu"
  );
  let menu = null;
  if (rawMenu.ok) menu = await rawMenu.json();

  let orderArray = Array<number>(menu.items.length);
  for (let i = 0; i < orderArray.length; i++) {
    orderArray[i] = 0;
  }

  return {
    props: { menu, orderArray }, // will be passed to the page component as props
  };
}

export default Menu;
