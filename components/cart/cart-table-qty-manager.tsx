"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface CartTableQtyManagerProps {
	item: CartItem;
	checkoutPending: boolean;
	setPending: CallableFunction;
}

const CartTableQtyManager = ({
	item,
	checkoutPending,
	setPending,
}: CartTableQtyManagerProps) => {
	const [isPending, startTransition] = useTransition();

	const handleAddToCart = async () => {
		setPending(true);
		startTransition(async () => {
			const res = await addItemToCart(item);
			setPending(false);
			if (!res.success) {
				toast.error(res.message);
				return;
			}

			toast.success(res.message);
		});
	};

	const handleRemoveFromCart = async () => {
		setPending(true);
		startTransition(async () => {
			const res = await removeItemFromCart(item.productId);
			setPending(false);

			if (!res.success) {
				toast.error(res.message);
				return;
			}

			toast.success(res.message);
		});
	};
	return (
		<>
			<Button
				disabled={isPending || checkoutPending}
				variant="outline"
				type="button"
				onClick={handleRemoveFromCart}
			>
				{isPending ? (
					<Loader className="w-4 h-4 animate-spin" />
				) : (
					<Minus className="w-4 h-4" />
				)}
			</Button>
			{item.qty}
			<Button
				disabled={isPending || checkoutPending}
				variant="outline"
				type="button"
				onClick={handleAddToCart}
			>
				{isPending ? (
					<Loader className="w-4 h-4 animate-spin" />
				) : (
					<Plus className="w-4 h-4" />
				)}
			</Button>
		</>
	);
};
export default CartTableQtyManager;
