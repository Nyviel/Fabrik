import { cn } from "@/lib/utils";

interface ProductPriceProps {
	value: number;
	className?: string;
}

const ProductPrice = ({ value, className }: ProductPriceProps) => {
	const formattedPrice = value.toFixed(2);
	const [integer, float] = formattedPrice.split(".");
	return (
		<p className={cn("text-2xl", className)}>
			<span className="text-xs align-super">zł</span>
			{integer}
			<span className="text-xs align-super">.{float}</span>
		</p>
	);
};
export default ProductPrice;
