import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";

const HomePage = async () => {
	const latestProducts = await getLatestProducts();
	return (
		<div>
			<ProductList
				data={latestProducts}
				title="Newest Arrivals"
				limit={LATEST_PRODUCTS_LIMIT}
			/>
		</div>
	);
};

export default HomePage;
