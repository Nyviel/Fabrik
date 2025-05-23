import {
	cartItemSchema,
	insertCartSchema,
	insertOrderItemSchema,
	insertOrderSchema,
	insertProductSchema,
	insertReviewSchema,
	paypalPaymentResultSchema,
	shippingAddressSchema,
} from "@/lib/validators";
import { z } from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
	id: string;
	rating: string;
	createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;

export type CartItem = z.infer<typeof cartItemSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type Order = z.infer<typeof insertOrderSchema> & {
	id: string;
	createdAt: Date;
	isPaid: boolean;
	paidAt: Date | null;
	isDelivered: boolean;
	deliveredAt: Date | null;
	orderitems: OrderItem[];
};

export type OrderItem = z.infer<typeof insertOrderItemSchema>;

export type PaypalPaymentResult = z.infer<typeof paypalPaymentResultSchema>;

export type Review = z.infer<typeof insertReviewSchema> & {
	id: string;
	createdAt: Date;
	user?: { name: string };
};
