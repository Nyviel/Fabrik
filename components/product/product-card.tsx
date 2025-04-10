import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "../rating/rating";

interface ProductCardProps {
	product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
	return (
		<Card className="pt-4 pb-2">
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
			<CardContent className="flex flex-col h-full py-2">
				<div className="text-xs">{product.brand}</div>
				<Link href={`product/${product.slug}`}>
					<h3 className="text-sm font-medium">{product.name}</h3>
				</Link>
				<div className="flex-1 flex-between justify-end gap-4 mt-4">
					<Rating value={Number(product.rating)} />
					{product.stock > 0 ? (
						<ProductPrice
							value={Number(product.price?.toString())}
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
