import ProductForm from "@/components/admin/product-form/product-form";
import { getProductById } from "@/lib/actions/product.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "Admin Product Update",
};

const AdminProductUpdatePage = async (props: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await props.params;
	const product = await getProductById(id);
	if (!product) return notFound();
	return (
		<div className="space-y-8 container mx-auto">
			<h1 className="h2-bold">Update Product</h1>
			<ProductForm type="update" product={product} />
		</div>
	);
};
export default AdminProductUpdatePage;
