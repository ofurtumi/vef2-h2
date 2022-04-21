import { Menu, Categories } from "../types";
import styles from "../styles/main.module.css";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const Menu = (props: {
  categories: Categories;
  menu: Menu;
  orderArray: Array<{ id: number; quantity: number }>;
}) => {
  const router = useRouter();
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>(
    props.orderArray
  );

  console.log('props.orderArray --> ', props.orderArray)

  const [cookie, setCookie] = useCookies(["cart"]);
  // console.log('endalaust')

  useEffect(() => {
    setCookie("cart", cart, { sameSite: true, path: "/", maxAge: 3600 });
  },[cart]);

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
        <form
          className={styles.cell}
          style={{
            gap: "1em",
            gridColumn: "span 2",
          }}
          onSubmit={(e: any) => {
            e.preventDefault();
            let search = e.target.search.value;
            search ? (search = "&search=" + search) : "";
            const url = window.location.href;
            if (url.includes("catID")) {
              const pos = url.lastIndexOf("catID");
              router.push(url.substring(0, pos + 7) + search);
            } else if (url.includes("search")) {
              const pos = url.lastIndexOf("search");
              console.log(
                "url.substring(0,pos) + search --> ",
                url.substring(0, pos) + search
              );
              router.push(url.substring(0, pos) + search.substring(1));
            } else {
              search = "?" + search.substring(1);
              router.push(url + search);
            }
          }}
        >
          <input type="text" name="search" />
          <button type="submit">Leita</button>
        </form>
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

  console.log("context.query --> ", context.query);
  const { catID, search } = context.query;
  let query = "";
  if (catID) query += "&category=" + catID;
  if (search) query += "&search=" + search;

  const rawMenu = await fetch(
    "https://vef2-2022-h1-synilausn.herokuapp.com/menu?&offset=0&limit=100" +
      (query ?? "")
  );
  let menu = null;
  if (rawMenu.ok) menu = await rawMenu.json();

  let orderArray = Array<{ id: number; quantity: number }>();
  const orderCookie = JSON.parse(context.req.cookies["cart"]);
  console.log('orderCookie[0] --> ', orderCookie[0])

  if (menu) {
    menu.items.map((item: { id: number },i:number) => {
      let itemid: number = item.id;
      let cookieID = orderCookie.findIndex((x:any) => x.id === item.id);
      orderArray.push({ id: itemid, quantity: cookieID !== -1 ? orderCookie[cookieID].quantity : 0 });
    });
  }
  menu.items = menu.items.sort((a:{id:number, quantity:number}, b:{id:number, quantity:number}) => (a.id > b.id) ? 1 : -1)

  return {
    props: { categories, menu, orderArray }, // will be passed to the page component as props
  };
}

export default Menu;
