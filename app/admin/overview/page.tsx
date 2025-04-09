import { auth } from "@/auth";
import Charts from "@/components/charts/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import { ArrowRight, Barcode, CreditCard, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { FaMoneyBill } from "react-icons/fa";

export const metadata: Metadata = {
	title: "Admin Dashboard",
};

const AdminOverviewPage = async () => {
	const session = await auth();

	if (session?.user?.role !== "admin") {
		throw new Error("User not authorized");
	}

	const summary = await getOrderSummary();

	return (
		<div className="space-y-4">
			<h1 className="h2-bold mb-10">Dashboard</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="py-4">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Revenue
						</CardTitle>
						<FaMoneyBill />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCurrency(
								summary.totalSales._sum.totalPrice?.toString() ||
									0
							)}
						</div>
					</CardContent>
				</Card>
				<Card className="py-4">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Sales
						</CardTitle>
						<p>
							<CreditCard />
						</p>
					</CardHeader>
					<CardContent>
						<div className="text-2xl h-full font-bold">
							{formatNumber(summary.ordersCount)}
						</div>
					</CardContent>
				</Card>
				<Card className="py-4">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Customers
						</CardTitle>
						<p>
							<Users />
						</p>
					</CardHeader>
					<CardContent>
						<div className="text-2xl h-full font-bold">
							{formatNumber(summary.usersCount)}
						</div>
					</CardContent>
				</Card>
				<Card className="py-4">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Products
						</CardTitle>
						<p>
							<Barcode />
						</p>
					</CardHeader>
					<CardContent>
						<div className="text-2xl h-full font-bold">
							{formatNumber(summary.productsCount)}
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Overview</CardTitle>
					</CardHeader>
					<CardContent>
						{summary.salesData.length === 0 ? (
							<h3 className="text-sm text-muted-foreground">
								No sales data found
							</h3>
						) : (
							<Charts data={summary.salesData} />
						)}
					</CardContent>
				</Card>
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Recent Sales</CardTitle>
					</CardHeader>
					<CardContent>
						{summary.latestSales.length === 0 ? (
							<h3 className="text-sm text-muted-foreground">
								No recent orders found
							</h3>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Buyer</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Total</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{summary.latestSales.map((sale) => {
										return (
											<TableRow key={sale.id}>
												<TableCell>
													{sale.user.name}
												</TableCell>
												<TableCell>
													{
														formatDateTime(
															sale.createdAt
														).dateOnly
													}
												</TableCell>
												<TableCell>
													{formatCurrency(
														sale.totalPrice
													)}
												</TableCell>
												<TableCell>
													<Link
														href={`/order/${sale.id}`}
														className=""
													>
														Details{" "}
														<ArrowRight className="w-4 h-4 inline-block" />
													</Link>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
export default AdminOverviewPage;
