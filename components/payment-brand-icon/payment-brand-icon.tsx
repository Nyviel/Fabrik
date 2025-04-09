import { FaMoneyBill, FaPaypal } from "react-icons/fa";

const PaymentBrandIcon = ({ brand }: { brand: string }) => {
	return brand.toLowerCase() === "paypal" ? (
		<FaPaypal className="w-10 h-10 inline-block mx-1" />
	) : (
		<FaMoneyBill className="w-10 h-10 inline-block mx-1" />
	);
};
export default PaymentBrandIcon;
