import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const convertToPlainObject = <T>(value: T): T => {
	return JSON.parse(JSON.stringify(value));
};

export const formatNumberWithFloat = (num: number): string => {
	const [integer, float] = num.toString().split(".");
	return float ? `${integer}.${float.padEnd(2, "0")}` : `${integer}.00`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (error: any) => {
	if (error.name === "ZodError") {
		const fieldErrors = error.errors.reduce(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(acc: string, cV: any) => acc + cV.message + ". ",
			""
		);
		return fieldErrors;
	} else if (
		error.name === "PrismaClientKnownRequestError" &&
		error.code === "P2002"
	) {
		const field = error.meta?.target ? error.meta.target[0] : "Field";

		return `${
			field.charAt(0).toUpperCase() + field.slice(1)
		} already exists`;
	} else {
		return typeof error.message === "string"
			? error.message
			: JSON.stringify(error.message);
	}
};

export function round2(value: number | string) {
	if (typeof value === "number") {
		return Math.round((value + Number.EPSILON) * 100) / 100;
	} else if (typeof value === "string") {
		return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
	} else {
		throw new Error("Value is not a number or string");
	}
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
	currency: "USD",
	style: "currency",
	minimumFractionDigits: 2,
});

export const formatCurrency = (amount: number | string | null) => {
	if (typeof amount === "number") {
		return CURRENCY_FORMATTER.format(amount);
	} else if (typeof amount === "string") {
		return CURRENCY_FORMATTER.format(Number(amount));
	}
	return NaN;
};
