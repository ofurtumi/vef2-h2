import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Order, User } from "../../types";
import styles from "../../styles/main.module.css";

const Order = (props: { order: Order; auth: boolean }) => {
  const router = useRouter();
  const [status, setStatus] = useState(
    props.order.current_state ?? props.order.status[0].state
  );

  let user: User;

  useEffect(() => {
    const isLoggedIn = JSON.parse(
      window.localStorage.getItem("isLoggedIn") ?? "false"
    );
    if (!isLoggedIn || !props.auth) router.push("/");
    const tempUser = window.localStorage.getItem("user");
    if (tempUser) user = JSON.parse(tempUser);
  });

  async function orderNextState() {
    if (status !== "FINISHED") {
      const endpoint = `https://vef2-2022-h1-synilausn.herokuapp.com/orders/${props.order.id}/status`;
      let body;

      switch (status) {
        case "NEW":
          body = { status: "PREPARE" };
          break;
        case "PREPARE":
          body = { status: "COOKING" };
          break;
        case "COOKING":
          body = { status: "READY" };
          break;
        case "READY":
          body = { status: "FINISHED" };
          break;
        default:
          break;
      }
      const tmpStatus = body?.status;
      body = JSON.stringify(body);

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
        body: body,
      };

      const update = await fetch(endpoint, options);
      if (update.ok && tmpStatus) setStatus(tmpStatus);
    }
  }

  return (
    <div className={styles.root}>
      {props.order ? (
        <div className={styles.prison}>
          <div
            className={styles.cell}
            style={{ justifyContent: "space-around" }}
          >
            <h1>Pöntun: {props.order.id}</h1>
            <h2>
              Staða: {status}
            </h2>
            <h3>Búin til: {props.order.created}</h3>
            <h3>Síðast breytt: {props.order.status[0].created}</h3>
            <button onClick={orderNextState}>Næsta staða pöntunar</button>
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
  const user = context.req.cookies["user"]
    ? JSON.parse(context.req.cookies["user"])
    : null;

  if (user) {
    let uid = context.params?.uid;
    let rawOrder = null;
    const endpoint = `https://vef2-2022-h1-synilausn.herokuapp.com/orders/${uid}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
    };
    try {
      rawOrder = await fetch(endpoint, options);
    } catch (error) {
      console.error(error);
    }

    const order = rawOrder?.ok ? await rawOrder.json() : null;
    return { props: { order: order, auth: true } };
  }
  return { props: { order: null, auth: false } };
}

export default Order;
