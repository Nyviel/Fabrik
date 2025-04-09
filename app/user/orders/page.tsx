import Pagination from "@/components/pagination/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getMyOrders } from "@/lib/actions/order.actions";
import { PAGE_SIZE } from "@/lib/constants";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "My Orders",
};

const OrdersPage = async (props: {
	searchParams: Promise<{ page: string }>;
}) => {
	const { page = 1 } = await props.searchParams;
	const orders = await getMyOrders(PAGE_SIZE, Number(page));

	return (
		<div>
			<h1 className="h2-bold mt-4 mb-8">My Orders</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Id</TableHead>
						<TableHead>Date</TableHead>
						<TableHead>Total</TableHead>
						<TableHead>Paid</TableHead>
						<TableHead>Delivered</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders.orders.map((order) => {
						return (
							<TableRow key={order.id}>
								<TableCell>{formatId(order.id)}</TableCell>
								<TableCell>
									{formatDateTime(order.createdAt).dateTime}
								</TableCell>
								<TableCell>
									{formatCurrency(order.totalPrice)}
								</TableCell>
								<TableCell>
									{order.isPaid && order.paidAt
										? formatDateTime(order.paidAt).dateTime
										: "Not Paid"}
								</TableCell>
								<TableCell>
									{order.isDelivered && order.deliveredAt
										? formatDateTime(order.deliveredAt)
												.dateTime
										: "Not Delivered"}
								</TableCell>
								<TableCell>
									<Link
										href={`/order/${order.id}`}
										className="font-semibold"
									>
										Details{" "}
										<ArrowRight className="w-4 h-4 ml-1 inline-block" />
									</Link>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			{orders.totalPages > 0 && (
				<Pagination
					page={page}
					totalPages={orders.totalPages}
					totalItems={orders.totalOrders}
				/>
			)}
		</div>
	);
};
export default OrdersPage;
