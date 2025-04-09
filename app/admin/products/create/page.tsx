import ProductForm from "@/components/admin/product-form/product-form";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Create Product",
};

const AdminProductsCreatePage = () => {
	return (
		<div>
			<h1 className="h2-bold">Create Product</h1>
			<div className="my-8">
				<ProductForm type="create" />
			</div>
		</div>
	);
};
export default AdminProductsCreatePage;
