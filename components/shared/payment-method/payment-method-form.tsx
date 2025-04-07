"use client";

import { useRouter } from "next/navigation";
import CheckoutSteps from "../checkout-steps";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import React, { FormEvent, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { paymentMethodSchema } from "@/lib/validators";
import PaymentBrandIcon from "../payment-brand-icon";

interface PaymentMethodFormProps {
	preferredPaymentMethod: string | null;
}

const PaymentMethodForm = ({
	preferredPaymentMethod,
}: PaymentMethodFormProps) => {
	const router = useRouter();
	const [currentMethod, setCurrentMethod] = useState(
		preferredPaymentMethod || DEFAULT_PAYMENT_METHOD
	);

	const [isPending, startTransition] = useTransition();

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault();
		startTransition(async () => {
			const values = paymentMethodSchema.parse({ type: currentMethod });
			const res = await updateUserPaymentMethod(values);

			if (!res.success) {
				toast.error(res.message);
				return;
			}

			router.push("/place-order");
		});
	};

	return (
		<>
			<CheckoutSteps current={2} />

			<div className="w-fit mx-auto space-y-4">
				<h1 className="h2-bold mt-4">Payment Method</h1>
				<p className="text-sm text-muted-foreground">
					Please select a payment method
				</p>
				<form className="space-y-4" onSubmit={onSubmit}>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
						{PAYMENT_METHODS.map((method) => (
							<div
								key={method}
								className="flex items-center justify-center space-x-4 w-64 h-32 border rounded-md cursor-pointer hover:bg-muted"
								onClick={() => setCurrentMethod(method)}
							>
								<input
									type="checkbox"
									id={method}
									checked={currentMethod === method}
									className="peer hidden"
									onChange={() => setCurrentMethod(method)}
								/>
								<label
									htmlFor={method}
									className="w-5 h-5 flex items-center justify-center bg-secondary border rounded-md cursor-pointer peer-checked:bg-primary peer-checked:border-primary peer-checked:after:content-['✔'] peer-checked:after:text-white peer-checked:after:text-lg"
								></label>
								<PaymentBrandIcon brand={method} />
								<label htmlFor={method}>{method}</label>
							</div>
						))}
					</div>
					<div className="flex justify-between gap-2">
						<div
							onClick={() => {
								startTransition(async () => {
									router.push("/shipping-address");
								});
							}}
							className="flex gap-2 border px-3 rounded-md text-sm cursor-pointer items-center w-fit"
						>
							{isPending ? (
								<Loader className="w-4 h-4 animate-spin" />
							) : (
								<ArrowLeft className="h-4 w-4" />
							)}{" "}
							Back
						</div>
						<Button type="submit" disabled={isPending}>
							{isPending ? (
								<Loader className="w-4 h-4 animate-spin" />
							) : (
								<ArrowRight className="h-4 w-4" />
							)}{" "}
							Continue
						</Button>
					</div>
				</form>
			</div>
		</>
	);
};
export default PaymentMethodForm;
