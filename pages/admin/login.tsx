import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "../../styles/main.module.css";

const Admin = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const isLoggedIn = JSON.parse(
      window.localStorage.getItem("isLoggedIn") ?? "false"
    );
    if (isLoggedIn) {
      setLoggedIn(true);
      router.push("/");
    }
  },[router]);

  const [cookie, setCookie] = useCookies(["user"]);

  const login = async (event: any) => {
    event.preventDefault();

    const data = {
      username: event.target.username.value,
      password: event.target.password.value,
    };
    const json = JSON.stringify(data);
    const endpoint = "https://vef2-2022-h1-synilausn.herokuapp.com/users/login";

    // ? endpoint fyrir heroku hjá árna
    // const endpoint =
    // 	'http://vef2h1-rfc.herokuapp.com/users/login';

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    };
    const response = await fetch(endpoint, options);
    if (response.ok) {
      const user = await response.json();
      setLoggedIn(true);
      window.localStorage.setItem("isLoggedIn", "true");
      window.localStorage.setItem("user", JSON.stringify(user));

      setCookie("user", JSON.stringify(user), {
        path: "/",
        maxAge: 3600, // Expires after 1hr
        sameSite: true,
      });
    }
    router.push('/')
  };

  return (
    <div className={styles.root}>
      <div className={styles.prison}>
        <div className={styles.suite}>
          <h1>Admin innskráning</h1>
          <form
            onSubmit={login}
            style={{
              marginTop: "0.5em",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1em",
            }}
          >
            <input type="text" name="username" />
            <input type="password" name="password" />
            <button style={{ gridColumn: "span 2" }}>Submit</button>
          </form>
          <h2>
            {loggedIn ? "innskráning tókst" : "skráðu þig inn fyrir ofan"}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Admin;
