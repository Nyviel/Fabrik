"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getUserById } from "./user.actions";
import { getMyCart } from "./cart.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, PaypalPaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";

export const createOrder = async () => {
	try {
		const session = await auth();
		if (!session) {
			throw new Error("User is not authenticated");
		}

		const userId = session.user?.id;
		if (!userId) {
			throw new Error("User not found");
		}

		const user = await getUserById(userId);
		if (!user) {
			throw new Error("User not found. Unexpected server error");
		}

		const cart = await getMyCart();
		if (!cart || cart.items.length === 0) {
			return {
				success: false,
				message: "Your cart is empty",
				redirectTo: "/cart",
			};
		}

		if (!user.address) {
			return {
				success: false,
				message: "Shipping address not found",
				redirectTo: "/shipping-address",
			};
		}

		if (!user.paymentMethod) {
			return {
				success: false,
				message: "Payment method not found",
				redirectTo: "/payment-method",
			};
		}

		const order = insertOrderSchema.parse({
			userId: user.id,
			shippingAddress: user.address,
			paymentMethod: user.paymentMethod,
			itemsPrice: cart.itemsPrice,
			taxPrice: cart.taxPrice,
			shippingPrice: cart.shippingPrice,
			totalPrice: cart.totalPrice,
		});

		const createdOrderId = await prisma.$transaction(async (tx) => {
			const createdOrder = await tx.order.create({ data: order });

			//Create order item for each item in the cart
			for (const item of cart.items as CartItem[]) {
				await tx.orderItem.create({
					data: { ...item, orderId: createdOrder.id },
				});
			}

			//Clear cart
			await tx.cart.update({
				where: { id: cart.id },
				data: {
					items: [],
					totalPrice: 0,
					taxPrice: 0,
					shippingPrice: 0,
					itemsPrice: 0,
				},
			});

			return createdOrder.id;
		});

		if (!createdOrderId) {
			throw new Error("Order not created");
		}

		return {
			success: true,
			message: "Order created successfully",
			redirectTo: `/order/${createdOrderId}`,
		};
	} catch (error) {
		if (isRedirectError(error)) throw error;
		return { success: false, message: formatError(error) };
	}
};

export const getOrderById = async (orderId: string) => {
	const order = await prisma.order.findFirst({
		where: { id: orderId },
		include: {
			orderitems: true,
			user: { select: { name: true, email: true } },
		},
	});

	return convertToPlainObject(order);
};

export const createPaypalOrder = async (orderId: string) => {
	try {
		const order = await prisma.order.findFirst({
			where: { id: orderId },
		});

		if (!order) {
			throw new Error("Order not found");
		}

		const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

		await prisma.order.update({
			where: { id: order.id },
			data: {
				paymentResult: {
					id: paypalOrder.id,
					email_address: "",
					status: "",
					pricePaid: 0,
				},
			},
		});

		return {
			success: true,
			message: "Paypal order created successfully",
			data: paypalOrder.id,
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
};

export const approvePaypalOrder = async (
	orderId: string,
	data: { orderID: string }
) => {
	try {
		const order = await prisma.order.findFirst({
			where: { id: orderId },
		});

		if (!order) {
			throw new Error("Order not found");
		}

		const captureData = await paypal.capturePayment(data.orderID);

		if (
			!captureData ||
			captureData.id !==
				(order.paymentResult as PaypalPaymentResult).id ||
			captureData.status !== "COMPLETED"
		) {
			throw new Error("Error in PayPal payment");
		}

		await updateOrderToPaid(orderId, {
			id: captureData.id,
			status: captureData.status,
			email_address: captureData.payer.email_address,
			pricePaid:
				captureData.purchase_units[0]?.payments?.captures[0].amount
					?.value,
		});

		revalidatePath(`/order/${order.id}`);

		return { success: true, message: "PayPal order approved successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

const updateOrderToPaid = async (
	orderId: string,
	paymentResult: PaypalPaymentResult
) => {
	const order = await prisma.order.findFirst({
		where: { id: orderId },
		include: { orderitems: true },
	});

	if (!order) {
		throw new Error("Order not found");
	}

	if (order.isPaid) {
		throw new Error("Order is already paid");
	}

	await prisma.$transaction(async (tx) => {
		for (const item of order.orderitems) {
			await tx.product.update({
				where: { id: item.productId },
				data: { stock: { increment: -item.qty } },
			});
		}

		await tx.order.update({
			where: { id: order.id },
			data: { isPaid: true, paidAt: new Date(), paymentResult },
		});
	});

	const updatedOrder = await prisma.order.findFirst({
		where: { id: orderId },
		include: {
			orderitems: true,
			user: { select: { name: true, email: true } },
		},
	});

	if (!updatedOrder) {
		throw new Error("Updated order not found");
	}
};

export const getMyOrders = async (limit = PAGE_SIZE, page: number) => {
	const session = await auth();
	if (!session || !session.user) {
		throw new Error("User is not authorized");
	}
	const data = await prisma.order.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: "desc" },
		skip: limit * (page - 1),
		take: limit,
	});

	const dataCount = await prisma.order.count({
		where: { userId: session.user.id },
	});

	return {
		orders: data,
		totalPages: Math.ceil(dataCount / limit),
		totalOrders: dataCount,
	};
};

type SalesDataType = {
	month: string;
	totalSales: number;
}[];

export const getOrderSummary = async () => {
	const ordersCount = await prisma.order.count();
	const productsCount = await prisma.product.count();
	const usersCount = await prisma.user.count();

	const totalSales = await prisma.order.aggregate({
		_sum: { totalPrice: true },
	});

	const salesDataRaw = await prisma.$queryRaw<
		Array<{ month: string; totalSales: Prisma.Decimal }>
	>`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

	const salesData: SalesDataType = salesDataRaw.map((entry) => ({
		month: entry.month,
		totalSales: Number(entry.totalSales),
	}));

	const latestSales = await prisma.order.findMany({
		orderBy: { createdAt: "desc" },
		include: {
			user: { select: { name: true } },
		},
		take: 6,
	});

	return {
		ordersCount,
		productsCount,
		usersCount,
		totalSales,
		salesData,
		latestSales,
	};
};

export const getAllOrders = async (page: number, limit = PAGE_SIZE) => {
	const data = await prisma.order.findMany({
		orderBy: { createdAt: "desc" },
		take: limit,
		skip: (page - 1) * limit,
		include: { user: { select: { name: true } } },
	});

	const dataCount = await prisma.order.count();

	return { data, dataCount };
};
