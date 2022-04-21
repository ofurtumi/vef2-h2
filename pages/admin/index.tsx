import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MenuItem, Category, User } from "../../types";
import styles from "../../styles/admin.module.css";
import { GetServerSidePropsContext } from "next";

const AdminPanel = (props: {
  user: User;
  food: Array<MenuItem>;
  categories: Array<Category>;
}) => {
  const router = useRouter();
  const [food, setFood] = useState(props.food);
  const [cats, setCats] = useState(props.categories);

  useEffect(() => {
    if (!props.user) {
      window.localStorage.setItem("isLoggedIn", "false");
      router.push("/");
    }
    // if (!JSON.parse(window.localStorage.getItem("isLoggedIn") ?? "false"))
    //   router.push("/");
    // const user = window.localStorage.getItem("user");
    // let tempUser = null;
    // if (user) {
    //   tempUser = JSON.parse(user);
    //   setUser(tempUser);
    // }
  }, []);

  // * er bara að fatta núna að ég commentaði eiginlega ekki neitt allt verkefnið :)
  // * gangi þér vel að fara yfir :) :)
  // ? hafa frekar generic option template fyrir allar þessar aðgerðir

  async function delFromDB(DB: string, id: number) {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + props.user.token,
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

  async function addFoodToDB(item: FormData) {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${props.user.token}`,
      },
      body: item,
    };

    const endpoint = "https://vef2-2022-h1-synilausn.herokuapp.com/menu";
    const res = await fetch(endpoint, options);
    const newFood = await (
      await fetch("https://vef2-2022-h1-synilausn.herokuapp.com/menu?limit=100")
    ).json();
    setFood(newFood.items);
  }

  return (
    <div className={styles.root}>
      <h1 style={{ textAlign: "center" }}>Halló {props.user.user.username}</h1>
      <div className={styles.prison}>
        <div className={styles.items}>
          <h2>Matur</h2>
          <div className={styles.cell}>
            <h3>Bæta á matseðil</h3>
            <form
              onSubmit={async (e: any) => {
                e.preventDefault();
                const foodItem = new FormData();
                foodItem.append("title", e.target.title.value);
                foodItem.append("price", e.target.price.value);
                foodItem.append("description", e.target.description.value);
                foodItem.append("category", e.target.category.value);
                foodItem.append("image", e.target.image.files[0]);
                addFoodToDB(foodItem);
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
                className={styles.selectFile}
                type="file"
                name="image"
                placeholder="Mynd"
                required
              />
              <span>
                <label htmlFor="category">Flokkur</label>
                <select name="category" id="category" placeholder="Flokkur">
                  {cats.map((c, i) => {
                    return (
                      <option key={i} value={c.id}>
                        {c.title}
                      </option>
                    );
                  })}
                </select>
              </span>
              <button type="submit">Bæta við</button>
            </form>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}
          >
            {food.map((f, i) => {
              return (
                <div className={styles.cell} key={i}>
                  <form
                    key={i}
                    className={styles.changeAble}
                    onSubmit={async (e: any) => {
                      e.preventDefault();
                      const foodItem = new FormData();
                      foodItem?.append("title", e.target.title.value);
                      foodItem?.append("price", e.target.price.value);
                      foodItem?.append(
                        "description",
                        e.target.description.value
                      );
                      foodItem.append("category", e.target.category.value);
                      if (e.target.image.files[0])
                        foodItem.append("image", e.target.image.files[0]);

                      const res = await fetch(
                        "https://vef2-2022-h1-synilausn.herokuapp.com/menu/" +
                          f.id,
                        {
                          method: "PATCH",
                          headers: {
                            Authorization: `Bearer ${props.user.token}`,
                          },
                          body: foodItem,
                        }
                      );
                    }}
                  >
                    <input
                      type="text"
                      name="title"
                      defaultValue={f.title}
                      placeholder="Nafn"
                      required
                    />
                    <input
                      type="text"
                      name="description"
                      defaultValue={f.description}
                      placeholder="Lýsing (valkvæmt)"
                    />
                    <input
                      type="number"
                      name="price"
                      defaultValue={f.price}
                      required
                    />
                    <input
                      className={styles.selectFile}
                      type="file"
                      name="image"
                      placeholder="Mynd"
                    />
                    <span>
                      <label htmlFor="category">Flokkur</label>
                      <select
                        name="category"
                        id="category"
                        placeholder="Flokkur"
                        defaultValue={f.category}
                      >
                        {cats.map((c, i) => {
                          return (
                            <option key={i} value={c.id}>
                              {c.title}
                            </option>
                          );
                        })}
                      </select>
                    </span>
                    <button type="submit">Breyta</button>
                    <button
                      onClick={() => {
                        let tempFood = [...food];
                        tempFood.splice(i, 1);
                        delFromDB("menu", f.id);
                        setFood(tempFood);
                      }}
                      style={{ background: "#f00" }}
                    >
                      Eyða!
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.categories}>
          <h2>Flokkar</h2>
          <div>
            {props.categories.map((c, i) => {
              return <p key={i}>{c.title}</p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let user = null;

  try {
    user = JSON.parse(context.req.cookies["user"]);
  } catch (error) {
    console.error("user not in cookies", error);
  }

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

  return { props: { user, food, categories } };
}

export default AdminPanel;
