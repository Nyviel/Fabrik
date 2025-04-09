import { auth } from "@/auth";
import OrderDetailsTable from "@/components/order-details/order-details-table";
import { getOrderById } from "@/lib/actions/order.actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { notFound, unauthorized } from "next/navigation";

export const metadata: Metadata = {
	title: "Order Details",
};

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
	const { id } = await props.params;

	const order = await getOrderById(id);

	if (!order) {
		notFound();
	}

	const session = await auth();

	if (!session || !session.user) {
		unauthorized();
	}

	if (session.user.id !== order.userId && session.user.role !== "admin") {
		unauthorized();
	}

	return (
		<div>
			<OrderDetailsTable
				order={{
					...order,
					shippingAddress: order.shippingAddress as ShippingAddress,
				}}
				paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
				isAdmin={session.user.role === "admin"}
			/>
		</div>
	);
};
export default OrderDetailsPage;
