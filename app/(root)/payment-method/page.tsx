import { auth } from "@/auth";
import PaymentMethodForm from "@/components/payment-method/payment-method-form";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Select Payment Method",
};

const PaymentMethodPage = async () => {
	const session = await auth();
	const userId = session?.user?.id;

	if (!userId) {
		throw new Error("User not found");
	}

	const user = await getUserById(userId);

	return (
		<div>
			<PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
		</div>
	);
};
export default PaymentMethodPage;
