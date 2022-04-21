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
      console.log("tempUser --> ", tempUser);
      setUser(tempUser);
    }
    console.log("token --> ", user);
  }, []);

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + user.token,
    },
  };

  async function delFromDB(DB: string, id: number) {
    const endpoint = `https://vef2-2022-h1-synilausn.herokuapp.com/${DB}/${id}`;
    try {
      const rawDel = await fetch(endpoint, options);
      console.log("rawDel --> ", rawDel);
      if (rawDel.ok) return;
    } catch (error) {
      console.error("error að eyða item eða category", error);
    }
  }

  async function addFoodToDB(item:MenuItem) {
      
  }

  return (
    <div className={styles.root}>
      <h1 style={{ textAlign: "center" }}>Halló {user.user.username}</h1>
      <div className={styles.prison}>
        <div className={styles.items}>
          <h2>Matur</h2>
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
