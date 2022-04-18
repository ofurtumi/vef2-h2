const Menu = ({props}:{props:any}) => {

}

export async function getServerSideProps() {
    const rawMenu = await fetch('https://vef2-2022-h1-synilausn.herokuapp.com/categories')
    let menuData = null;
    if (rawMenu.ok) menuData = await rawMenu.json()
    console.log('menuData --> ', menuData)

    return {
      props: {}, // will be passed to the page component as props
    }
  }
  

export default Menu;