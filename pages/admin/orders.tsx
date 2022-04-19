import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Order, Orders, User } from "../../types";

const Orders = (props: { user: User; orders: Orders }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  useEffect(() => {
    if (!props.user) {
      window.localStorage.setItem("isLoggedIn", "false");
      router.push("/");
    } else setOrders(props.orders.items);
  });

  return (
    <div>
      {orders.map((order, i) => {
        if (order.current_state !== "FINISHED") {
          return (
            <div key={i}>
              <h2 style={{ margin: "0" }}>{i}</h2>
              <p>Order id: {order.id}</p>
              <p>Order status: {order.current_state}</p>
              <p>Order created: {order.created}</p>
              <p>Order updated: {order.current_state_created}</p>
            </div>
          );
        }
      })}
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let user = null;
  let res = null;
  try {
    user = JSON.parse(context.req.cookies["user"]);
    const endpoint = `https://vef2-2022-h1-synilausn.herokuapp.com/orders`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
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
