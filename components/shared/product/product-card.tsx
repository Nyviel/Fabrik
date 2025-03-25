import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";

interface ProductCardProps {
	product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
	console.log(product);
	return (
		<Card>
			<CardHeader>
				<Link href={`/product/${product.slug}`}>
					<Image
						src={product.images[0]}
						alt={product.name}
						width={300}
						height={300}
						priority={true}
					/>
				</Link>
			</CardHeader>
			<CardContent className="flex flex-col h-full">
				<div className="text-xs">{product.brand}</div>
				<Link href={`product/${product.slug}`}>
					<h3 className="text-sm font-medium">{product.name}</h3>
				</Link>
				<div className="flex-1 flex-between gap-4">
					<p>{product.rating.toString()} stars</p>
					{product.stock > 0 ? (
						<ProductPrice
							value={Number(product.price.toString())}
						/>
					) : (
						<p className="text-destructive">Out Of Stock</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
export default ProductCard;
