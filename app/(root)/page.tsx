import ProductCarousel from "@/components/product/product-carousel";
import ProductList from "@/components/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products-button/view-all-products-button";
import {
	getFeaturedProducts,
	getLatestProducts,
} from "@/lib/actions/product.actions";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";

const HomePage = async () => {
	const latestProducts = await getLatestProducts();
	const featuredProducts = await getFeaturedProducts();
	return (
		<div>
			{featuredProducts.length > 0 && (
				<ProductCarousel data={featuredProducts} />
			)}
			<ProductList
				data={latestProducts}
				title="Newest Arrivals"
				limit={LATEST_PRODUCTS_LIMIT}
			/>
			<ViewAllProductsButton />
		</div>
	);
};

export default HomePage;
