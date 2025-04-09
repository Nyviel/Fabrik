"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
	approvePaypalOrder,
	createPaypalOrder,
	deliverOrder,
	updateOrderToPaidCOD,
} from "@/lib/actions/order.actions";
import { toast } from "sonner";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

interface OrderDetailsTableProps {
	order: Order;
	paypalClientId: string;
	isAdmin: boolean;
}

const OrderDetailsTable = ({
	order,
	paypalClientId,
	isAdmin,
}: OrderDetailsTableProps) => {
	const PrintLoadingState = () => {
		const [{ isPending, isRejected }] = usePayPalScriptReducer();

		let status = "";

		if (isPending) {
			status = "Loading PayPal...";
		} else if (isRejected) {
			status = "Error Loading PayPal";
		}

		return status;
	};

	const handleCreatePayPalOrder = async () => {
		const res = await createPaypalOrder(order.id);
		if (!res.success) {
			toast.error(res.message);
		}

		return res.data;
	};

	const handleApprovePayPalOrder = async (data: { orderID: string }) => {
		const res = await approvePaypalOrder(order.id, data);
		if (!res.success) {
			toast.error(res.message);
		} else {
			toast.success(res.message);
		}
	};

	const MarkAsPaidButton = () => {
		const [isPending, startTransition] = useTransition();

		return (
			<Button
				type="button"
				disabled={isPending}
				onClick={() =>
					startTransition(async () => {
						const res = await updateOrderToPaidCOD(order.id);
						if (res.success) {
							toast.success(
								`Order ...${order.id.slice(10)} marked as paid`
							);
						} else {
							toast.error(
								`Failed to mark order ...${order.id.slice(
									10
								)} as paid`
							);
						}
					})
				}
			>
				{isPending ? "...Processing" : "Mark as Paid"}
			</Button>
		);
	};

	const MarkAsDeliveredButton = () => {
		const [isPending, startTransition] = useTransition();
		return (
			<Button
				type="button"
				disabled={isPending}
				onClick={() =>
					startTransition(async () => {
						const now = new Date(Date.now());
						const res = await deliverOrder(order.id, now);
						if (res.success) {
							toast.success(
								`Order ...${order.id.slice(
									10
								)} marked as delivered`
							);
						} else {
							toast.error(
								`Failed to mark order ...${order.id.slice(
									10
								)} as delivered`
							);
						}
					})
				}
			>
				{isPending ? "...Processing" : "Mark as Delivered"}
			</Button>
		);
	};

	return (
		<div>
			<h1 className="py-4 h2-bold">Order {formatId(order.id)}</h1>
			<div className="grid md:grid-cols-3 md:gap-5">
				<div className="col-span-2 space-y-4 overflow-x-auto">
					<Card className="py-4">
						<CardContent className="px-4 space-y-4">
							<h2 className="text-xl font-semibold">
								Payment Method
							</h2>
							<hr />
							<p className="bg-muted w-fit px-2 py-1 rounded-sm">
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Badge className="bg-green-600 text-secondary">
									Paid at{" "}
									{formatDateTime(order.paidAt!).dateTime}
								</Badge>
							) : (
								<Badge variant={"destructive"}>Not paid</Badge>
							)}
						</CardContent>
					</Card>
					<Card className="py-4">
						<CardContent className="px-4 py-2">
							<h2 className="text-xl pb-4 font-semibold">
								Shipping Address
							</h2>
							<hr />
							<p className="bg-muted w-fit px-2 py-1 my-4 rounded-sm">
								{order.shippingAddress.fullName}
							</p>
							<p className="bg-muted w-fit px-2 py-1 mb-4  rounded-sm">
								{order.shippingAddress.streetAddress},{" "}
								{order.shippingAddress.city}{" "}
								{order.shippingAddress.postalCode},{" "}
								{order.shippingAddress.country}
							</p>
							{order.isDelivered ? (
								<Badge className="bg-green-600 text-secondary">
									Delivered at{" "}
									{
										formatDateTime(order.deliveredAt!)
											.dateTime
									}
								</Badge>
							) : (
								<Badge variant={"destructive"}>
									Not delivered
								</Badge>
							)}
						</CardContent>
					</Card>
					<Card className="py-4">
						<CardContent className="px-4 space-y-4">
							<h2 className="text-xl font-semibold">
								Order Items
							</h2>
							<hr />
							<p className="text-sm">
								Selection of ordered items
							</p>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead>Quantity</TableHead>
										<TableHead>Price</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{order.orderitems.map((item) => {
										return (
											<TableRow key={item.slug}>
												<TableCell>
													<Link
														className="flex items-center"
														href={`/product/${item.slug}`}
													>
														<Image
															src={item.image}
															alt="Product image"
															width={50}
															height={50}
														/>
														<span className="px-2">
															{item.name}
														</span>
													</Link>
												</TableCell>
												<TableCell>
													<span className="px-2">
														{item.qty}
													</span>
												</TableCell>
												<TableCell>
													<span>
														{formatCurrency(
															Number(item.price)
														)}
													</span>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
				<div>
					<Card className="py-4">
						<CardContent className="space-y-4">
							<h2 className="text-xl font-semibold">Costs</h2>
							<hr />
							<div className="flex justify-between">
								<p className="font-semibold">Items</p>
								<p>{formatCurrency(order.itemsPrice)}</p>
							</div>
							<div className="flex justify-between">
								<p className="font-semibold">Tax</p>
								<p>{formatCurrency(order.taxPrice)}</p>
							</div>
							<div className="flex justify-between">
								<p className="font-semibold">Shipping</p>
								<p>{formatCurrency(order.shippingPrice)}</p>
							</div>
							<div className="flex justify-between">
								<p className="font-semibold">Total</p>
								<p>{formatCurrency(order.totalPrice)}</p>
							</div>
							{!order.isPaid &&
								order.paymentMethod === "PayPal" && (
									<div>
										<PayPalScriptProvider
											options={{
												clientId: paypalClientId,
												currency: "PLN",
											}}
										>
											<PrintLoadingState />
											<PayPalButtons
												createOrder={
													handleCreatePayPalOrder
												}
												onApprove={
													handleApprovePayPalOrder
												}
											/>
										</PayPalScriptProvider>
									</div>
								)}
							{isAdmin &&
								!order.isPaid &&
								order.paymentMethod === "CashOnDelivery" && (
									<MarkAsPaidButton />
								)}
							{isAdmin && order.isPaid && !order.isDelivered && (
								<MarkAsDeliveredButton />
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};
export default OrderDetailsTable;
