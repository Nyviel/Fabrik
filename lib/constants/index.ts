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
	: ["PayPal", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD =
	process.env.DEFAULT_PAYMENT_METHOD || "PayPal";
export const PAYPAL_API_URL =
	process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 6;
export const productDefaultValues = {
	name: "",
	slug: "",
	category: "",
	images: [],
	brand: "",
	description: "",
	price: "0",
	stock: 0,
	rating: "0",
	numReviews: "0",
	isFeatured: false,
	banner: null,
};
export const USER_ROLES = process.env.USER_ROLES?.split(", ") || [
	"user",
	"admin",
];
export const PRICES = [
	{ name: "All", value: "all" },
	{ name: "1zł to 50zł", value: "1-50" },
	{ name: "51zł to 100zł", value: "51-100" },
	{ name: "101zł to 150zł", value: "101-150" },
	{ name: "151zł to 200zł", value: "151-200" },
	{ name: "201zł to 300zł", value: "201-300" },
	{ name: "301zł to 400zł", value: "301-400" },
	{ name: "401zł to 500zł", value: "401-500" },
	{ name: "501zł to 1000zł", value: "501-1000" },
];
export const RATINGS = ["5", "4", "3", "2", "1"];
export const SORT_ORDERS = ["newest", "lowest", "highest", "rating"];
export const reviewFormDefaultValues = {
	title: "",
	description: "",
	rating: 0,
};
