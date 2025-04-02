export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Fabrik";
export const APP_TITLE =
	process.env.NEXT_PUBLIC_APP_TITLE || "Fabrik | Your fashion brand";
export const APP_DESCRIPTION =
	process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
	"Ecommerce website for fashion and apparel trade.";
export const APP_KEYWORDS = process.env.NEXT_PUBLIC_APP_KEYWORDS || [
	"ecommerce",
	"e-commerce",
	"fabrik",
	"fabric",
	"clothes",
	"apparel",
	"fashion",
	"attire",
	"t-shirt",
	"hoodies",
];
export const APP_AUTHORS = (() => {
	try {
		const parsedAuthors = JSON.parse(
			process.env.NEXT_PUBLIC_APP_AUTHORS || "{}"
		);
		if (typeof parsedAuthors === "object" && parsedAuthors !== null) {
			return parsedAuthors;
		}
	} catch (error) {
		console.error("Failed to parse NEXT_PUBLIC_APP_AUTHORS:", error);
	}
	return {
		name: "Przemysław Kaczmarski",
		url: "https://pkaczmarski.pages.dev",
	};
})();
export const SERVER_URL =
	process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
	Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const SHIPPING_ADDRESS_DEFAULT_VALUES = {
	fullName: "",
	streetAddress: "",
	postalCode: "",
	city: "",
	country: "",
};
export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
	? process.env.PAYMENT_METHODS.split(", ")
	: ["PayPal", "Stripe", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD =
	process.env.DEFAULT_PAYMENT_METHOD || "PayPal";
