import { Menu } from "../types";
import styles from "../styles/main.module.css";
import { useState } from "react";

const Menu = (props: { menu: Menu, orderArray: Array<number> }) => {
  // const [orders, setOrders] = useState(Array.apply(null, Array(props.menu.items.length)).map(function (x=0) { return x; }));
  const [orders, setOrders] = useState(props.orderArray);
  // ! okok svo þetta "virkar" en ehv týpu vandamál, laga þetta setja any eða ehv þannig
  // todo: setja ákv týpu á þetta eða bara leysa öðruvísi
  const sum = orders.reduce((acc, item) => acc + item, 0);
  
  return (
    <div className={styles.prison}>
      {props.menu.items.map((item, i) => {
        return (
          <div className={styles.cell}>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
            <h2>{item.price}</h2>
            {/* // ! bruh hvernig í fokkanum set ég any á þetta shit */}
            <h3>{orders[i]}</h3>
            {/* <Image src={item.image} layout='fill'></Image> */}
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
      <p>summa: {sum}</p>
    </div>
  );
};

export async function getServerSideProps() {
  const rawMenu = await fetch(
    "https://vef2-2022-h1-synilausn.herokuapp.com/menu"
  );
  let menu = null;
  if (rawMenu.ok) menu = await rawMenu.json();

  let orderArray = Array<number>(menu.items.length)
  for (let i = 0; i < orderArray.length; i++) {
    orderArray[i] = 0;
  }

  return {
    props: { menu, orderArray }, // will be passed to the page component as props
  };
}

export default Menu;
