import Pagination from "@/components/pagination/pagination";
import DeleteDialog from "@/components/delete-dialog/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { deleteProduct, getAllProducts } from "@/lib/actions/product.actions";
import { formatCurrency, formatId } from "@/lib/utils";
import Link from "next/link";

const AdminProductsPage = async (props: {
	searchParams: Promise<{ page: string; query: string; category: string }>;
}) => {
	const searchParams = await props.searchParams;

	const page = Number(searchParams.page) || 1;
	const search = searchParams.query || "";
	const category = searchParams.category || "";

	const products = await getAllProducts({
		query: search,
		page: page,
		category: category,
	});

	return (
		<div className="space-y-4">
			<div className="flex-between">
				<div className="flex items-end gap-3">
					<h1 className="h2-bold">Products</h1>
					{search && (
						<div className="flex items-end gap-3">
							<p>
								Filtered by <i>&quot;{search}&quot;</i>
							</p>
							<Link href={"/admin/products"}>
								<Badge
									variant={"outline"}
									className="border-red-600"
								>
									Remove filter
								</Badge>
							</Link>
						</div>
					)}
				</div>
				<Button asChild variant={"default"}>
					<Link href={`/admin/products/create`}>Create Product</Link>
				</Button>
			</div>
			{products.data.length === 0 ? (
				<h2 className="text-muted-foreground font-light">
					No products found
				</h2>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Id</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Stock</TableHead>
							<TableHead>Rating</TableHead>
							<TableHead className="w-[100px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{products.data.map((product) => {
							return (
								<TableRow key={product.id}>
									<TableCell>
										{formatId(product.id)}
									</TableCell>
									<TableCell>{product.name}</TableCell>
									<TableCell>
										{formatCurrency(product.price)}
									</TableCell>
									<TableCell>{product.category}</TableCell>
									<TableCell>{product.stock}</TableCell>
									<TableCell>{product.rating}</TableCell>
									<TableCell className="flex gap-2">
										<Button
											asChild
											variant={"outline"}
											size={"sm"}
										>
											<Link
												href={`/admin/products/${product.id}`}
											>
												Edit
											</Link>
										</Button>
										<DeleteDialog
											id={product.id}
											action={deleteProduct}
										/>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			)}

			{products.totalPages > 0 && (
				<Pagination
					page={page}
					totalPages={products.totalPages}
					totalItems={products.totalItems}
				/>
			)}
		</div>
	);
};
export default AdminProductsPage;
