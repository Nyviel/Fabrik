import { Metadata } from "next";
import CartTable from "@/components/cart/cart-table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Shopping Cart",
};

const CartPage = async () => {
	let cart;
	try {
		cart = await getMyCart();
	} catch (error) {
		console.error(error);
		redirect("/");
	}
	return (
		<div>
			<CartTable cart={cart} />
		</div>
	);
};
export default CartPage;
