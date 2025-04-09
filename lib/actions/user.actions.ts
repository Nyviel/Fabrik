"use server";

import {
	paymentMethodSchema,
	shippingAddressSchema,
	signInFormSchema,
	signUpFormSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { z } from "zod";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export const signInWithCredentials = async (
	prevState: unknown,
	formData: FormData
) => {
	try {
		const user = signInFormSchema.parse({
			email: formData.get("email"),
			password: formData.get("password"),
		});
		await signIn("credentials", user);

		return { success: true, message: "Signed in successfully" };
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}

		return { success: false, message: "Invalid credentials" };
	}
};

export const signOutUser = async () => {
	await signOut();
};

export const signUpUser = async (prevState: unknown, formData: FormData) => {
	try {
		const user = signUpFormSchema.parse({
			name: formData.get("name"),
			email: formData.get("email"),
			password: formData.get("password"),
			confirmPassword: formData.get("confirmPassword"),
		});

		const plainPassword = user.password;

		user.password = hashSync(user.password, 10);

		await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		});

		await signIn("credentials", {
			email: user.email,
			password: plainPassword,
		});

		return { success: true, message: "Account created successfully" };
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}
		return { success: false, message: formatError(error) };
	}
};

export const getUserById = async (id: string) => {
	const user = await prisma.user.findFirst({ where: { id: id } });

	if (!user) {
		throw new Error("User not found");
	}

	return user;
};

export const updateUserAddress = async (data: ShippingAddress) => {
	try {
		const session = await auth();
		if (!session || !session.user) {
			throw new Error("Session not found");
		}

		const currentUser = await prisma.user.findFirst({
			where: { id: session?.user?.id },
		});

		if (!currentUser) {
			throw new Error("User not found");
		}

		const address = shippingAddressSchema.parse(data);

		await prisma.user.update({
			where: { id: currentUser.id },
			data: { address },
		});

		return { success: true, message: "User address updated successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const updateUserPaymentMethod = async (
	data: z.infer<typeof paymentMethodSchema>
) => {
	try {
		const session = await auth();

		if (!session || !session.user) {
			throw new Error("Session not found");
		}

		const currentUser = await prisma.user.findFirst({
			where: { id: session.user.id },
		});

		if (!currentUser) {
			throw new Error("User not found");
		}

		const paymentMethod = paymentMethodSchema.parse(data);

		await prisma.user.update({
			where: { id: currentUser.id },
			data: {
				paymentMethod: paymentMethod.type,
			},
		});

		return {
			success: true,
			message: "User payment method updated successfully.",
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
};

export const updateUserProfile = async (newUser: {
	name: string;
	email: string;
}) => {
	try {
		const session = await auth();
		if (!session || !session.user) {
			throw new Error("Session not found");
		}

		const user = await prisma.user.findFirst({
			where: { id: session.user.id },
		});

		if (!user) {
			throw new Error("User not found");
		}

		await prisma.user.update({
			where: { id: user.id },
			data: { name: newUser.name },
		});

		return { success: true, message: "User updated successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const getAllUsers = async (
	page: number,
	query: string,
	limit = PAGE_SIZE
) => {
	const queryFilter: Prisma.UserWhereInput = {};

	if (query && query !== "all") {
		queryFilter.name = {
			contains: query,
			mode: "insensitive",
		};
		// queryFilter.email = {
		// 	contains: query,
		// 	mode: "insensitive",
		// };
	}

	const data = await prisma.user.findMany({
		where: { ...queryFilter },
		orderBy: { createdAt: "desc" },
		skip: (page - 1) * limit,
		take: limit,
	});

	const dataCount = await prisma.user.count({ where: { ...queryFilter } });

	return {
		data: convertToPlainObject(data),
		totalPages: Math.ceil(dataCount / limit),
		totalItems: dataCount,
	};
};

export const deleteUser = async (id: string) => {
	try {
		await prisma.user.delete({ where: { id } });

		revalidatePath("/admin/users");

		return { success: true, message: "User deleted successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};

export const updateUser = async (newUser: {
	name: string;
	email: string;
	role: string;
	id: string;
}) => {
	try {
		const session = await auth();

		if (!session || !session.user) {
			throw new Error("Session not found");
		}

		if (session.user.role !== "admin") {
			throw new Error("Unauthorized");
		}

		const user = await prisma.user.findFirst({
			where: { id: newUser.id },
		});

		if (!user) {
			throw new Error("User not found");
		}

		await prisma.user.update({
			where: { id: newUser.id },
			data: { name: newUser.name, role: newUser.role },
		});

		return { success: true, message: "User updated successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
};
