"use server";

import type { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const calcPrice = (items: CartItem[]) => {
	const itemsPrice = round2(
		items.reduce((acc, cV) => acc + Number(cV.price) * cV.qty, 0)
	);
	const shippingPrice = round2(itemsPrice > 100 ? 0 : 100);
	const taxPrice = round2(0.15 * itemsPrice);
	const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

	return {
		itemsPrice: itemsPrice.toFixed(2),
		shippingPrice: shippingPrice.toFixed(2),
		taxPrice: taxPrice.toFixed(2),
		totalPrice: totalPrice.toFixed(2),
	};
};

export const addItemToCart = async (data: CartItem) => {
	try {
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;
		if (!sessionCartId) throw new Error("Cart session not found");

		const session = await auth();
		const userId = session?.user?.id ?? undefined;

		const cart = await getMyCart();

		const item = cartItemSchema.parse(data);

		const product = await prisma.product.findFirst({
			where: { id: item.productId },
		});

		if (!product) {
			throw new Error("Product not found");
		}

		if (!cart) {
			const newCart = insertCartSchema.parse({
				userId: userId,
				items: [item],
				sessionCartId: sessionCartId,
				...calcPrice([item]),
			});

			await prisma.cart.create({
				data: newCart,
			});

			revalidatePath(`/product/${product.slug}`);

			return {
				success: true,
				message: `${product.name} added to cart.`,
			};
		}

		const itemExists = cart.items.find(
			(it) => it.productId === item.productId
		);

		if (itemExists) {
			if (product.stock < itemExists.qty + 1) {
				throw new Error("Not enough stock");
			}

			itemExists.qty++;
		} else {
			if (product.stock < 1) {
				throw new Error("Not enough stock");
			}

			cart.items.push(item);
		}

		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				items: cart.items as Prisma.CartUpdateitemsInput[],
				...calcPrice(cart.items as CartItem[]),
			},
		});

		revalidatePath(`/product/${product.slug}`);

		return {
			success: true,
			message: `${product.name} ${
				!itemExists ? "added to" : "updated in"
			} cart.`,
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const getMyCart = async () => {
	const sessionCartId = (await cookies()).get("sessionCartId")?.value;
	if (!sessionCartId) throw new Error("Cart session not found");

	const session = await auth();
	const userId = session?.user?.id ?? undefined;

	const cart = await prisma.cart.findFirst({
		where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
	});
	if (!cart) return undefined;

	return convertToPlainObject({
		...cart,
		items: cart.items as CartItem[],
		itemsPrice: cart.itemsPrice.toString(),
		totalPrice: cart.totalPrice.toString(),
		shippingPrice: cart.shippingPrice.toString(),
		taxPrice: cart.taxPrice.toString(),
	});
};

export const removeItemFromCart = async (id: string) => {
	try {
		const sessionCartId = (await cookies()).get("sessionCartId")?.value;
		if (!sessionCartId) throw new Error("Cart session not found");

		const product = await prisma.product.findFirst({
			where: { id: id },
		});

		if (!product) {
			throw new Error("Product not found");
		}

		const cart = await getMyCart();

		if (!cart) {
			throw new Error("Cart not found");
		}

		const existingItem = cart.items.find((it) => it.productId === id);
		if (!existingItem) {
			throw new Error("Item not found in cart");
		}

		const qtyAbove1 = existingItem.qty > 1;
		if (qtyAbove1) {
			existingItem.qty--;
		} else {
			cart.items = cart.items.filter((it) => it.productId !== id);
		}

		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				items: cart.items as Prisma.CartUpdateitemsInput[],
				...calcPrice(cart.items as CartItem[]),
			},
		});

		revalidatePath(`/product/${product.slug}`);

		return {
			success: true,
			message: `${product.name} ${
				qtyAbove1 ? "updated in" : "removed from"
			} cart.`,
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};
