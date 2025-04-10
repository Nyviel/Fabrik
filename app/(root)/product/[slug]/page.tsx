import { auth } from "@/auth";
import AddToCart from "@/components/product/add-to-cart";
import ProductImages from "@/components/product/product-images";
import ProductPrice from "@/components/product/product-price";
import Rating from "@/components/rating/rating";
import ReviewList from "@/components/review/review-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound, redirect } from "next/navigation";

const ProductPage = async (props: { params: Promise<{ slug: string }> }) => {
	const { slug } = await props.params;

	const product = await getProductBySlug(slug);
	if (!product) notFound();

	let cart;
	try {
		cart = await getMyCart();
	} catch (error) {
		console.error(error);
		redirect("/");
	}

	const session = await auth();

	return (
		<>
			<section>
				<div className="grid grid-cols-1 md:grid-cols-5">
					<div className="col-span-2">
						<ProductImages images={product.images} />
					</div>
					<div className="col-span-2  pl-4">
						<div className="flex flex-col gap-6">
							<p>
								{product.brand} {product.category}
							</p>
							<h1 className="h2-bold">{product.name}</h1>
							<p>
								<Rating value={Number(product.rating)} />
							</p>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
								<ProductPrice
									value={Number(product.price)}
									className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
								/>
							</div>
						</div>
						<div className="mt-10">
							<p className="font-semibold">Description</p>
							<p>{product.description}</p>
						</div>
					</div>
					<div>
						<Card className="py-0">
							<CardContent className="p-4">
								<div className="mb-2 flex justify-between">
									<div>Price</div>
									<div>
										<ProductPrice
											value={Number(product.price)}
										/>
									</div>
								</div>
								<hr />
								<div className="my-3 flex justify-between">
									<div>Status</div>
									{product.stock > 0 ? (
										<Badge variant={"outline"}>
											In Stock
										</Badge>
									) : (
										<Badge variant={"destructive"}>
											Out Of Stock
										</Badge>
									)}
								</div>
								{product.stock > 0 && <hr />}
								{product.stock > 0 && (
									<div className="flex-center">
										<AddToCart
											cart={cart}
											item={{
												productId: product.id,
												name: product.name,
												slug: product.slug,
												price: product.price,
												qty: 1,
												image: product.images[0],
											}}
										/>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
			<section className="mt-10">
				<h2 className="h2-bold">Customer Reviews</h2>
				<ReviewList
					userId={session?.user.id || ""}
					productId={product.id}
					productSlug={product.slug}
				/>
			</section>
		</>
	);
};
export default ProductPage;
