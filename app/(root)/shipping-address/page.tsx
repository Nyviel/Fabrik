import { auth } from "@/auth";
import CheckoutSteps from "@/components/checkout-steps";
import ShippingAddressForm from "@/components/shipping-address/shipping-address-form";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Shipping Address",
};

const ShippingAddressPage = async () => {
	let cart;
	try {
		cart = await getMyCart();
		if (!cart || cart.items.length === 0) redirect("/cart");
	} catch (error) {
		console.error(error);
		redirect("/");
	}

	const session = await auth();
	const userId = session?.user?.id;
	if (!userId) throw new Error("User id not found");

	let user;
	try {
		user = await getUserById(userId);
	} catch (error) {
		console.error(error);
		redirect("/");
	}

	return (
		<div>
			<CheckoutSteps current={1} />
			<ShippingAddressForm address={user.address as ShippingAddress} />
		</div>
	);
};
export default ShippingAddressPage;
