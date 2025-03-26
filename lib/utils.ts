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
