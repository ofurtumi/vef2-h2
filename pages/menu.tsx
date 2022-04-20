import { Menu, Categories } from "../types";
import styles from "../styles/main.module.css";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

const Menu = (props: {
  categories: Categories;
  menu: Menu;
  orderArray: Array<{ id: number; quantity: number }>;
}) => {
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>(
    props.orderArray
  );

  const [cookie, setCookie] = useCookies(["cart"]);
  // console.log('endalaust')

  useEffect(() => {
    setCookie("cart", cart, { sameSite: true, path: "/", maxAge: 3600 });
  }, [cart]);

  function changeCart(id: number, change: number) {
    const i = cart.findIndex((x) => x.id === id);
    if (i === -1) {
      console.error("ehv vesen í addToCart, færð -1");
      return;
    }
    setCart([
      ...cart.slice(0, i),
      { id: cart[i].id, quantity: cart[i].quantity + change },
      ...cart.slice(i + 1),
    ]);
  }

  return (
    <div className={styles.root}>
      <div className={styles.prison}>
        <div className={styles.cell} style={{ gridColumn: "span 2" }}>
          <h4
            style={{
              textAlign: "center",
            }}
          >
            <Link href={"/menu"}>Allt</Link>
          </h4>
        </div>
        <div className={styles.categoryLink}>
          {props.categories.items.map((cat, i) => {
            return (
              <div className={styles.cell} key={i}>
                <h4 style={{ textAlign: "center" }}>
                  <Link href={"/menu?catID=" + cat.id}>{cat.title}</Link>
                </h4>
              </div>
            );
          })}
        </div>
        {props.menu.items.length > 0 ? (
          props.menu.items.map((item, i) => {
            return (
              <div key={i} className={styles.cell}>
                <a style={{ width: "100%" }} href={"/food/" + item.id}>
                  <span>
                    <h1>{item.title}</h1>
                    <h2>{item.price}kr</h2>
                  </span>
                </a>
                <img src={item.image} alt="" />
                <div className={styles.cellButtons}>
                  <button
                    onClick={() => {
                      changeCart(item.id, -1);
                    }}
                  >
                    Fjarlægja úr körfu
                  </button>
                  {/* <h3>{cart[i].id}</h3> */}
                  <h3>
                    {cart[cart.findIndex((x) => x.id === item.id)].quantity}
                  </h3>
                  <button
                    onClick={() => {
                      changeCart(item.id, 1);
                    }}
                  >
                    Bæta í körfu
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>Þessi flokkur er tómur :(</p>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let categories = null;
  try {
    const rawCategories = await fetch(
      "https://vef2-2022-h1-synilausn.herokuapp.com/categories"
    );

    if (rawCategories.ok) {
      categories = await rawCategories.json();
    }
    // ? category=4&
  } catch (error) {
    console.error("error að sækja categories", error);
  }

  const { catID = "" } = context.query;
  let query = "";
  if (catID) query = "&category=" + catID;

  let catExist = false;
  try {
    if (
      await (
        await fetch("https://vef2-2022-h1-synilausn.herokuapp.com/categories")
      ).ok
    )
      catExist = true;
  } catch (error) {
    console.error("category ekki til", error);
  }

  const rawMenu = await fetch(
    "https://vef2-2022-h1-synilausn.herokuapp.com/menu?&offset=0&limit=100" +
      (catExist ? query : "")
  );
  let menu = null;
  if (rawMenu.ok) menu = await rawMenu.json();

  let orderArray = Array<{ id: number; quantity: number }>();
  if (menu) {
    menu.items.map((item: { id: number }) => {
      let itemid: number = item.id;
      orderArray.push({ id: itemid, quantity: 0 });
    });
  }
  // console.log('orderArray --> ', orderArray)
  try {
    if (context.req.cookies["cart"]) {
      orderArray = JSON.parse(context.req.cookies["cart"]);
    }
  } catch (error) {
    console.error("asdf", error);
  }

  return {
    props: { categories, menu, orderArray }, // will be passed to the page component as props
  };
}

export default Menu;
