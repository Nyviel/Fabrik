import { auth } from "@/auth";
import CheckoutSteps from "@/components/checkout-steps";
import PaymentBrandIcon from "@/components/payment-brand-icon/payment-brand-icon";
import PlaceOrderForm from "@/components/place-order/place-order-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { Pencil } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Place Order",
};

const PlaceOrderPage = async () => {
	let cart;
	try {
		cart = await getMyCart();
		if (!cart || cart.items.length === 0) redirect("/cart");
	} catch (error) {
		console.error(error);
		redirect("/");
	}

	const session = await auth();
	if (!session || !session.user) {
		console.error("Session not found");
		redirect("/");
	}

	const userId = session.user.id;
	if (!userId) {
		console.error("User not found");
		redirect("/");
	}

	let user;
	try {
		user = await getUserById(userId);
		if (!user.address) {
			redirect("/shipping-address");
		}
		if (!user.paymentMethod) {
			redirect("/payment-method");
		}
	} catch (error) {
		console.error(error);
		redirect("/");
	}

	const userAddress = user.address as ShippingAddress;

	return (
		<div>
			<CheckoutSteps current={3} />
			<h1 className="h2-bold py-4">Place Order</h1>
			<div className="grid md:grid-cols-3 md:gap-5">
				<div className="md:col-span-2 overflow-x-auto space-y-4">
					<Card className="py-4">
						<CardContent className="px-4 py-2">
							<h2 className="text-xl font-semibold pb-4">
								Shipping Address
							</h2>
							<hr />
							<p className="bg-muted w-fit px-2 py-1 my-4 rounded-sm">
								{userAddress.fullName}
							</p>
							<p className="bg-muted w-fit px-2 py-1 rounded-sm">
								{userAddress.streetAddress}, {userAddress.city}{" "}
								{userAddress.postalCode}, {userAddress.country}
							</p>
							<div className="mt-3">
								<Link href="/shipping-address">
									<Button
										variant="outline"
										className="w-24 border !border-primary"
									>
										<Pencil /> Edit
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>

					<Card className="py-4">
						<CardContent className="px-4 space-y-4">
							<h2 className="text-xl font-semibold">
								Payment Method
							</h2>
							<hr />
							<p className="bg-muted w-fit px-2 py-1 rounded-sm">
								<PaymentBrandIcon brand={user.paymentMethod} />{" "}
								{user.paymentMethod}
							</p>
							<div className="mt-3">
								<Link href="/payment-method">
									<Button
										variant="outline"
										className="w-24 border !border-primary"
									>
										<Pencil />
										Edit
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>

					<Card className="py-4">
						<CardContent className="px-4 space-y-4">
							<h2 className="text-xl font-semibold">
								Order Items
							</h2>
							<hr />
							<p className="text-sm">Items added to the cart</p>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead>Quantity</TableHead>
										<TableHead>Price</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{cart.items.map((item) => {
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
							<div className="mt-3">
								<Link href="/cart">
									<Button
										variant="outline"
										className="w-24 border !border-primary"
									>
										<Pencil />
										Edit
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
				<div>
					<Card className="py-4">
						<CardContent className=" space-y-4">
							<h2 className="text-xl font-semibold">Costs</h2>
							<hr />
							<div className="flex justify-between">
								<p>Items</p>
								<p>{formatCurrency(cart.itemsPrice)}</p>
							</div>
							<div className="flex justify-between">
								<p>Tax</p>
								<p>{formatCurrency(cart.taxPrice)}</p>
							</div>
							<div className="flex justify-between">
								<p>Shipping</p>
								<p>{formatCurrency(cart.shippingPrice)}</p>
							</div>
							<div className="flex justify-between">
								<p>Total</p>
								<p>{formatCurrency(cart.totalPrice)}</p>
							</div>
							<PlaceOrderForm />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};
export default PlaceOrderPage;
