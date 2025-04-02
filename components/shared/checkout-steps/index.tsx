import { cn } from "@/lib/utils";
import React from "react";

const steps = [
	"User Login",
	"Shipping Address",
	"Payment Method",
	"Place Order",
];

const CheckoutSteps = ({ current = 0 }) => {
	return (
		<div className="flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10">
			{steps.map((step, i) => (
				<React.Fragment key={step}>
					<div
						className={cn(
							"p-2 w-56 rounded-full text-center text-sm",
							i === current && "bg-secondary"
						)}
					>
						{step}
					</div>
					{step !== "Place Order" && (
						<hr className="w-16 border-t mx-2" />
					)}
				</React.Fragment>
			))}
		</div>
	);
};
export default CheckoutSteps;
