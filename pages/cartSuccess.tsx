import { GetServerSideProps, GetServerSidePropsContext } from 'next';

const OrderSuccess = (props: { id: any }) => {
	return <h1>Pöntun tókst</h1>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const id = context.req.cookies['order']
  console.log('id --> ', id)
  // ? hérna á að koma websocket dæmi til að sækja upplýsingar um staka pöntun
	// const rawOrder = await fetch('https://vef2-2022-h1-synilausn.herokuapp.com/orders/'+id)
  // console.log('rawOrder --> ', rawOrder)
  return (
    {props: {id}}
  )
}

export default OrderSuccess;
