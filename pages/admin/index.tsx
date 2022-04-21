import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MenuItem, Category } from "../../types";
import styles from "../../styles/admin.module.css";
import { GetServerSidePropsContext } from "next";

const AdminPanel = (props: {
  food: Array<MenuItem>;
  categories: Array<Category>;
}) => {
  const router = useRouter();
  const [food, setFood] = useState(props.food);
  const [cats, setCats] = useState(props.categories);
  const [user, setUser] = useState({
    token: "",
    expiresIn: 0,
    user: {
      admin: false,
      created: "",
      email: "",
      id: 0,
      updated: "",
      username: "",
    },
  });
  useEffect(() => {
    if (!JSON.parse(window.localStorage.getItem("isLoggedIn") ?? "false"))
      router.push("/");
    const user = window.localStorage.getItem("user");
    let tempUser = null;
    if (user) {
      tempUser = JSON.parse(user);
      setUser(tempUser);
    }
  }, []);

  // * er bara að fatta núna að ég commentaði eiginlega ekki neitt allt verkefnið :)
  // * gangi þér vel að fara yfir :) :)
  // ? hafa frekar generic option template fyrir allar þessar aðgerðir

  async function delFromDB(DB: string, id: number) {
    const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": ("Bearer " + user.token),
        },
      };
    const endpoint = `https://vef2-2022-h1-synilausn.herokuapp.com/${DB}/${id}`;
    try {
      const rawDel = await fetch(endpoint, options);
      if (rawDel.ok) return;
    } catch (error) {
      console.error("error að eyða item eða category", error);
    }
  }

  async function addFoodToDB(item: {
      title: string;
      description: string;
      price: number;
      image: any;
      category: number;
  }) {
    const options = {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": ("Bearer " + user.token),
        },
        body: JSON.stringify(item)
      };

    console.log("addOptions --> ", options);
    const endpoint = "https://vef2-2022-h1-synilausn.herokuapp.com/menu";
    try {
      const rawAdd = await fetch(endpoint, options);
      console.log("rawAdd --> ", rawAdd);
      if (rawAdd.ok) return;
    } catch (error) {
      console.error("error að bæta við item", error);
    }
  }

  return (
    <div className={styles.root}>
      <h1 style={{ textAlign: "center" }}>Halló {user.user.username}</h1>
      <div className={styles.prison}>
        <div className={styles.items}>
          <h2>Matur</h2>
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              console.log('e.target.image --> ', e.target.image)
              const item = {
                title: e.target.title.value,
                description: e.target.description.value,
                price: Number(e.target.price.value),
                image: e.target.image.value,
                category: Number(e.target.category.value),
              };
              addFoodToDB(item);
              console.log("item --> ", item);
            }}
          >
            <input type="text" name="title" placeholder="Nafn" required />
            <input
              type="text"
              name="description"
              placeholder="Lýsing (valkvæmt)"
            />
            <input type="number" name="price" placeholder="Verð" required />
            <input
              type="file"
              name="image"
              placeholder="Linkur á mynd"
              required
            />
            <label htmlFor="category">Flokkur</label>
            <select name="category" id="category" placeholder="Flokkur">
              {cats.map((c) => {
                return <option value={c.id}>{c.title}</option>;
              })}
            </select>
            <button type="submit">Bæta við</button>
          </form>
          <div>
            {food.map((f, i) => {
              return (
                <div key={i}>
                  <p>{f.title}</p>
                  <button
                    onClick={() => {
                      let tempFood = [...food];
                      tempFood.splice(i, 1);
                      delFromDB("menu", f.id);
                      setFood(tempFood);
                    }}
                  >
                    Eyða!
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.categories}>
          <h2>Flokkar</h2>
          <div>
            {props.categories.map((c) => {
              return <p>{c.title}</p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const rawFood = await fetch(
    "https://vef2-2022-h1-synilausn.herokuapp.com/menu?limit=100"
  );
  let food = null;
  if (rawFood.ok) food = (await rawFood.json()).items;

  const rawCats = await fetch(
    "https://vef2-2022-h1-synilausn.herokuapp.com/categories?limit=100"
  );
  let categories = null;
  if (rawCats.ok) categories = (await rawCats.json()).items;

  return { props: { food, categories } };
}

export default AdminPanel;
