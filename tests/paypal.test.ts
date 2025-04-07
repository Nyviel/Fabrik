// Test to generate access token from paypal

import { generateAccessToken, paypal } from "../lib/paypal";

test("should generate a paypal token", async () => {
	const tokenResponse = await generateAccessToken();

	expect(typeof tokenResponse).toBe("string");
	expect(tokenResponse.length).toBeGreaterThan(0);
});

test("should create order", async () => {
	const price = 10.0;
	const orderResponse = await paypal.createOrder(price);

	expect(orderResponse).toHaveProperty("id");
	expect(orderResponse).toHaveProperty("status");
	expect(orderResponse.status).toBe("CREATED");
});

test("should capture mocked order", async () => {
	const orderId = "100";

	const mockCapturePayment = jest
		.spyOn(paypal, "capturePayment")
		.mockResolvedValue({
			status: "COMPLETED",
		});

	const captureResponse = await paypal.capturePayment(orderId);

	expect(captureResponse).toHaveProperty("status", "COMPLETED");
	mockCapturePayment.mockRestore();
});
