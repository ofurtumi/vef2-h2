import Link from "next/link";
import { useEffect, useState } from "react";

const Footer = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const isLoggedIn = JSON.parse(
      window.localStorage.getItem("isLoggedIn") ?? "false"
    );
    setLoggedIn(isLoggedIn);
  }), [setLoggedIn];
  const JC = loggedIn ? "space-between" : "flex-end";
  return (
    <footer
      style={{
        width: "100%",
        overflow: "hidden",
        margin: "0 auto",
        display: "flex",
        justifyContent: JC,
        alignItems: "center",
        position: "fixed",
        bottom: "0",
        background: "#eee",
        height: "2em",
      }}
    >
      {loggedIn ? <h3 style={{ margin: "0 1em" }}>Innskráð/ur</h3> : null}

      {loggedIn ? (
        <div
          style={{
            margin: "0 1em",
            display: "flex",
            justifyContent: "space-between",
            gap: "2em",
          }}
        >
          <Link href="/admin/logout" passHref>
            Skrá út
          </Link>
          <Link href="/admin/orders" passHref>
            Pantanir
          </Link>
          <Link href="/admin/" passHref>
            Stjórnborð
          </Link>
        </div>
      ) : (
        <div
          style={{
            margin: "0 1em",
          }}
        >
          <Link href="/admin/login" passHref>
            Skrá inn
          </Link>
        </div>
      )}
    </footer>
  );
};

export default Footer;
