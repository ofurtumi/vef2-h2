import { Menu } from "../types";
import styles from '../styles/main.module.css'

const Menu = (props: { menu: Menu }) => {
  console.log('props.menu --> ', props.menu)
  return (
    <div className={styles.prison}>
      {props.menu.items.map((item)=> {
        return (
          <div className={styles.cell}>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
            <h2>{item.price}</h2>
            {/* <Image src={item.image} layout='fill'></Image> */}
          </div>
        )
      })}
    </div>
  )
};

export async function getServerSideProps() {
  const rawMenu = await fetch(
    "https://vef2-2022-h1-synilausn.herokuapp.com/menu"
  );
  let menu = null;
  if (rawMenu.ok) menu = await rawMenu.json();

  return {
    props: { menu }, // will be passed to the page component as props
  };
}

export default Menu;
