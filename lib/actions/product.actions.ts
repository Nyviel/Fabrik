"use server";

import { prisma } from "@/db/prisma";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { convertToPlainObject, formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";
import { Prisma } from "@prisma/client";

export const getLatestProducts = async () => {
	const data = await prisma.product.findMany({
		take: LATEST_PRODUCTS_LIMIT,
		orderBy: { createdAt: "desc" },
	});

	return convertToPlainObject(data);
};

export const getProductBySlug = async (slug: string) => {
	return await prisma.product.findFirst({ where: { slug: slug } });
};

// Get all products
export async function getAllProducts({
	query,
	limit = PAGE_SIZE,
	page,
	category,
	price,
	rating,
	sort,
}: {
	query: string;
	limit?: number;
	page: number;
	category?: string;
	price?: string;
	rating?: string;
	sort?: string;
}) {
	const queryFilter: Prisma.ProductWhereInput =
		query && query !== "all"
			? {
					name: {
						contains: query,
						mode: "insensitive",
					} as Prisma.StringFilter,
			  }
			: {};

	// Category filter
	const categoryFilter = category && category !== "all" ? { category } : {};

	// Price filter
	const priceFilter: Prisma.ProductWhereInput =
		price && price !== "all"
			? {
					price: {
						gte: Number(price.split("-")[0]),
						lte: Number(price.split("-")[1]),
					},
			  }
			: {};

	// Rating filter
	const ratingFilter =
		rating && rating !== "all"
			? {
					rating: {
						gte: Number(rating),
						lte: 6,
					},
			  }
			: {};

	const data = await prisma.product.findMany({
		where: {
			...queryFilter,
			...categoryFilter,
			...priceFilter,
			...ratingFilter,
		},
		orderBy:
			sort === "lowest"
				? { price: "asc" }
				: sort === "highest"
				? { price: "desc" }
				: sort === "rating"
				? { rating: "desc" }
				: { createdAt: "desc" },
		skip: (page - 1) * limit,
		take: limit,
	});

	const dataCount = await prisma.product.count({
		where: {
			...queryFilter,
			...categoryFilter,
			...priceFilter,
			...ratingFilter,
		},
	});

	return {
		data: convertToPlainObject(data),
		totalPages: Math.ceil(dataCount / limit),
		totalItems: dataCount,
	};
}

export const deleteProduct = async (id: string) => {
	try {
		await prisma.product.delete({ where: { id } });

		revalidatePath("/admin/products");

		return { success: true, message: "Product deleted successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const createProduct = async (
	data: z.infer<typeof insertProductSchema>
) => {
	try {
		const product = insertProductSchema.parse(data);
		await prisma.product.create({ data: product });

		revalidatePath("/admin/products");
		return {
			success: true,
			message: "Product created successfully",
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const updateProduct = async (
	data: z.infer<typeof updateProductSchema>
) => {
	try {
		const product = updateProductSchema.parse(data);
		await prisma.product.update({ where: { id: data.id }, data: product });

		revalidatePath("/admin/products");
		return {
			success: true,
			message: "Product updated successfully",
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const getProductById = async (id: string) => {
	const data = await prisma.product.findFirst({ where: { id } });

	return convertToPlainObject(data);
};

export const getAllCategories = async () => {
	const data = await prisma.product.groupBy({
		by: ["category"],
		_count: true,
	});

	return convertToPlainObject(data);
};

export const getFeaturedProducts = async () => {
	const data = await prisma.product.findMany({
		where: { isFeatured: true },
		orderBy: { createdAt: "desc" },
		take: 4,
	});

	return convertToPlainObject(data);
};
