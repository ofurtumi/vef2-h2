import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Order, User } from "../../types";
import styles from "../../styles/main.module.css";
import Link from "next/link";

const Orders = (props: { user: User; propOrders: Array<Order> }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  useEffect(() => {
    if (!props.user) {
      window.localStorage.setItem("isLoggedIn", "false");
      router.push("/");
    } else {
      setOrders(props.propOrders);
    }
  },[]);

  function color(s:string) {
	  switch (s) {
		  case 'NEW':
			  return {backgroundColor:'white'}
		  case 'PREPARE':
			  return {backgroundColor:'yellow'}
		  case 'COOKING':
			  return {backgroundColor:'orange'}
		  case 'READY':
			  return {backgroundColor:'lightgreen'}
		  case 'FINISHED':
			  return {backgroundColor:'red'}
		  default:
			  break;
	  }
  }

  return (
    <div className={styles.root}>
      <div className={styles.prison}>
        {orders.map((order, i) => {
			
          return (
            <Link key={i} href={"/orders/" + order.id}>
              <div className={styles.hoverable} style={color(order.current_state)}>
                <h2 style={{ margin: "0" }}>{i + 1}</h2>
                <p>Order id: {order.id}</p>
                <p>Order status: {order.current_state}</p>
                <p>Order created: {order.created}</p>
                <p>Order updated: {order.current_state_created}</p>
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
    user = JSON.parse(context.req.cookies["user"]);
    const endpoint = `https://vef2-2022-h1-synilausn.herokuapp.com/orders?offset=0&limit=100`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
    };
    res = await fetch(endpoint, options);
  } catch (error) {}

  let usedOrders: Array<Order> = [];

  function doesItExist(order: Order) {
    let index = -1;
    usedOrders.map((UO, i) => {
      if (UO.id === order.id) {
        index = i;
        return;
      }
    });
    if (index !== -1) usedOrders[index] = order;
    else usedOrders.push(order);
  }

  let propOrders = null;
  if (res && res.ok) {
    const orders = await res.json();
	const reverse = orders.items.slice(0).reverse();
    reverse.map((o: Order) => doesItExist(o));
    console.log("usedOrders --> ", usedOrders.length);
    if (reverse.length > usedOrders.length) propOrders = usedOrders;
	else propOrders =reverse
  }

  return { props: { user, propOrders } };
}

export default Orders;
