import { auth } from "@/auth";
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
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { PAGE_SIZE } from "@/lib/constants";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Admin Orders",
};

const AdminOrdersPage = async (props: {
	searchParams: Promise<{ page: string; query: string }>;
}) => {
	const { page = 1, query } = await props.searchParams;

	const session = await auth();
	if (!session || !session.user || session.user.role !== "admin") {
		throw new Error("Not authenticated or authorized");
	}

	const orders = await getAllOrders(Number(page), query, PAGE_SIZE);
	return (
		<div className="space-y-4">
			<div className="flex items-end gap-3">
				<h1 className="h2-bold">Orders</h1>
				{query && (
					<div className="flex items-end gap-3">
						<p>
							Filtered by <i>&quot;{query}&quot;</i>
						</p>
						<Link href={"/admin/orders"}>
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
			{orders.data.length === 0 ? (
				<h2 className="text-muted-foreground font-light">
					No orders found
				</h2>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Id</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>User</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Paid</TableHead>
							<TableHead>Delivered</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.data.map((order) => {
							return (
								<TableRow key={order.id}>
									<TableCell>{formatId(order.id)}</TableCell>
									<TableCell>
										{
											formatDateTime(order.createdAt)
												.dateTime
										}
									</TableCell>
									<TableCell>{order.user.name} </TableCell>
									<TableCell>
										{formatCurrency(order.totalPrice)}
									</TableCell>
									<TableCell>
										{order.isPaid && order.paidAt
											? formatDateTime(order.paidAt)
													.dateTime
											: "Not Paid"}
									</TableCell>
									<TableCell>
										{order.isDelivered && order.deliveredAt
											? formatDateTime(order.deliveredAt)
													.dateTime
											: "Not Delivered"}
									</TableCell>
									<TableCell className="space-x-2">
										<Button
											asChild
											variant={"outline"}
											size={"sm"}
										>
											<Link
												href={`/order/${order.id}`}
												className="font-semibold"
											>
												Details
											</Link>
										</Button>
										<DeleteDialog
											id={order.id}
											action={deleteOrder}
										/>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			)}
			{orders.totalPages > 0 && (
				<Pagination
					page={page}
					totalPages={orders.totalPages}
					totalItems={orders.totalItems}
				/>
			)}
		</div>
	);
};
export default AdminOrdersPage;
