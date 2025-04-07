import { FaMoneyBill, FaPaypal, FaStripe } from "react-icons/fa";

const PaymentBrandIcon = ({ brand }: { brand: string }) => {
	return brand.toLowerCase() === "stripe" ? (
		<FaStripe className="w-10 h-10 inline-block mx-1" />
	) : brand.toLowerCase() === "paypal" ? (
		<FaPaypal className="w-10 h-10 inline-block mx-1" />
	) : (
		<FaMoneyBill className="w-10 h-10 inline-block mx-1" />
	);
};
export default PaymentBrandIcon;
