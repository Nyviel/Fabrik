"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getUserById } from "./user.actions";
import { getMyCart } from "./cart.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";

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

		prisma.$transaction(async (tx) => {
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
	} catch (error) {
		if (isRedirectError(error)) throw error;
		return { success: false, message: formatError(error) };
	}
};
