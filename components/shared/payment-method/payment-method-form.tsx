"use client";

import { useRouter } from "next/navigation";
import CheckoutSteps from "../checkout-steps";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import React, { useTransition } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { toast } from "sonner";

interface PaymentMethodFormProps {
	preferredPaymentMethod: string | null;
}

const PaymentMethodForm = ({
	preferredPaymentMethod,
}: PaymentMethodFormProps) => {
	const router = useRouter();

	const form = useForm<z.infer<typeof paymentMethodSchema>>({
		resolver: zodResolver(paymentMethodSchema),
		defaultValues: {
			type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
		},
	});

	const [isPending, startTransition] = useTransition();

	const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
		startTransition(async () => {
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

			<div className="max-w-md mx-auto space-y-4">
				<h1 className="h2-bold mt-4">Payment Method</h1>
				<p className="text-sm text-muted-foreground">
					Please select a payment method
				</p>
				<Form {...form}>
					<form
						method="post"
						className="space-y-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className="flex flex-col gap-5 py-4 md:flex-row">
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem className="space-y-3">
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												className="flex flex-col space-y-3"
											>
												{PAYMENT_METHODS.map(
													(method) => (
														<FormItem
															key={method}
															className="flex items-center space-x-3 space-y-0"
														>
															<FormControl>
																<RadioGroupItem
																	value={
																		method
																	}
																	checked={
																		field.value ===
																		method
																	}
																/>
															</FormControl>
															<FormLabel className="font-normal">
																{method}
															</FormLabel>
														</FormItem>
													)
												)}
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
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
				</Form>
			</div>
		</>
	);
};
export default PaymentMethodForm;
