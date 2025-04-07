import { PAYPAL_API_URL } from "./constants";

export const paypal = {
	createOrder: async (price: number) => {
		const accessToken = await generateAccessToken();
		const url = `${PAYPAL_API_URL}/v2/checkout/orders`;

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				intent: "CAPTURE",
				purchase_units: [
					{
						amount: {
							currency_code: "PLN",
							value: price,
						},
					},
				],
			}),
		});

		return handleResponse(response);
	},

	capturePayment: async (orderId: string) => {
		const accessToken = await generateAccessToken();
		const url = `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`;

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});

		return handleResponse(response);
	},
};

// Generate access token

const generateAccessToken = async () => {
	const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

	const auth = Buffer.from(
		`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`
	).toString("base64");

	const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
		method: "POST",
		body: "grant_type=client_credentials",
		headers: {
			Authorization: `Basic ${auth}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});

	const jsonData = await handleResponse(response);
	return jsonData.access_token;
};

const handleResponse = async (response: Response) => {
	if (response.ok) {
		return response.json();
	}

	const error = await response.text();
	throw new Error(error);
};

export { generateAccessToken };
