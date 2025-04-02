"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface AddToCartProps {
	cart?: Cart;
	item: CartItem;
}

const AddToCart = ({ cart, item }: AddToCartProps) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const itemExists = cart?.items.find(
		(it) => it.productId === item.productId
	);

	const handleAddToCart = async () => {
		startTransition(async () => {
			const res = await addItemToCart(item);

			if (!res.success) {
				toast.error(res.message);
				return;
			}

			toast.success(res.message, {
				action: (
					<Button
						className="bg-green-800 text-green-300   hover:bg-green-700"
						onClick={() => {
							router.push("/cart");
						}}
					>
						Go To Cart
					</Button>
				),
			});
		});
	};

	const handleRemoveFromCart = async () => {
		startTransition(async () => {
			const res = await removeItemFromCart(item.productId);

			if (!res.success) {
				toast.error(res.message);
				return;
			}

			toast.success(res.message, {
				action: (
					<Button
						className="bg-green-800 text-green-300 hover:bg-green-700"
						onClick={() => {
							router.push("/cart");
						}}
					>
						Go To Cart
					</Button>
				),
			});
		});
	};

	return itemExists ? (
		<div className="flex gap-4 items-center justify-center mt-3">
			<Button
				type="button"
				variant={"outline"}
				onClick={handleRemoveFromCart}
			>
				{isPending ? (
					<Loader className="w-4 h-4 animate-spin" />
				) : (
					<Minus className="h-4 w-4" />
				)}
			</Button>
			{itemExists.qty}
			<Button type="button" variant={"outline"} onClick={handleAddToCart}>
				{isPending ? (
					<Loader className="w-4 h-4 animate-spin" />
				) : (
					<Plus className="h-4 w-4" />
				)}
			</Button>
		</div>
	) : (
		<Button className="w-full" type="button" onClick={handleAddToCart}>
			{isPending ? (
				<Loader className="w-4 h-4 animate-spin" />
			) : (
				<Plus className="h-4 w-4" />
			)}
			Add To Cart
		</Button>
	);
};
export default AddToCart;
