import {
	amountMajorToMinor,
	creditsFromMinorAmount,
} from "../../../shared/payments/catalog.js";
import {
	getMissingCustomerFields,
	normalizeCustomerProfile,
} from "../../../shared/payments/customer.js";
import {
	buildInvoice,
	buildPaymentHash,
	parseCreatePaymentResponse,
} from "../../../shared/payments/safepay-server.js";
import { getCorsHeaders, jsonResponse } from "../_shared/cors.ts";
import { createAdminClient } from "../_shared/supabase.ts";
import { verifyFirebaseToken } from "../_shared/firebase.ts";

const gatewayUrl =
	Deno.env.get("SAFEPAY_GATEWAY_URL") ||
	"https://www.safepayto.me/new/gateway/";

function requiredEnv(name: string) {
	const value = Deno.env.get(name);
	if (!value) throw new Error(`Missing required environment variable: ${name}`);
	return value;
}

Deno.serve(async (request) => {
	if (request.method === "OPTIONS") {
		return new Response("ok", { headers: getCorsHeaders(request) });
	}

	if (request.method !== "POST") {
		return jsonResponse({ error: "Method not allowed." }, 405, request);
	}

	try {
		const authHeader = request.headers.get("Authorization");
		const idToken = authHeader?.replace(/^Bearer\s+/i, "") ?? "";

		if (!idToken) {
			return jsonResponse(
				{ error: "You must be signed in to pay." },
				401,
				request,
			);
		}

		let firebaseUser: { uid: string; email?: string };

		try {
			firebaseUser = await verifyFirebaseToken(idToken);
		} catch {
			return jsonResponse(
				{ error: "Invalid or expired session." },
				401,
				request,
			);
		}

		const adminClient = createAdminClient();
		const body = await request.json();
		const currency = String(body?.currency || "").toUpperCase();
		const merchantId = requiredEnv("SAFEPAY_MERCHANT_ID");
		const merchantSecret = requiredEnv("SAFEPAY_MERCHANT_SECRET");

		let amountMinor: number;
		let creditsToAdd: number;

		try {
			amountMinor = amountMajorToMinor(body?.amount, currency);
			creditsToAdd = creditsFromMinorAmount(amountMinor, currency);
		} catch (error) {
			return jsonResponse(
				{
					error:
						error instanceof Error
							? error.message
							: "Invalid amount or currency.",
				},
				422,
				request,
			);
		}

		const normalizedCustomer = normalizeCustomerProfile({
			firstName: body?.customer?.firstName,
			lastName: body?.customer?.lastName,
			email: body?.customer?.email || firebaseUser.email,
			phone: body?.customer?.phone,
			countryCode: body?.customer?.countryCode,
			city: body?.customer?.city,
		});
		const missingFields = getMissingCustomerFields(normalizedCustomer);

		if (missingFields.length > 0) {
			return jsonResponse(
				{
					error: `Missing required billing fields: ${missingFields.join(", ")}`,
					missingFields,
				},
				422,
				request,
			);
		}

		const invoice = buildInvoice({ prefix: "LUX", userId: firebaseUser.uid });
		const description = `LuxuryUI credit top-up (${creditsToAdd} credits)`;

		const payload = new URLSearchParams({
			_cmd: "payment",
			merchant_id: merchantId,
			amount: String(amountMinor),
			currency,
			invoice,
			language: "ENG",
			cl_fname: normalizedCustomer.firstName,
			cl_lname: normalizedCustomer.lastName,
			cl_email: normalizedCustomer.email,
			cl_phone: normalizedCustomer.phone,
			cl_country: normalizedCustomer.countryCode,
			cl_city: normalizedCustomer.city,
			description,
			psys: "",
			get_trans: "1",
			hash: buildPaymentHash({
				amountMinor,
				currency,
				merchantId,
				merchantSecret,
			}),
		});

		const providerResponse = await fetch(gatewayUrl, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: payload,
		});
		const providerText = await providerResponse.text();

		if (!providerResponse.ok) {
			return jsonResponse(
				{
					error: "SafePay rejected the payment session request.",
					details: providerText,
				},
				502,
				request,
			);
		}

		let checkoutUrl: string;
		let providerTransactionId: string;

		try {
			({ checkoutUrl, providerTransactionId } = parseCreatePaymentResponse(
				providerText,
				{
					allowedHosts: [
						new URL(gatewayUrl).hostname,
						"www.safepayto.me",
						"safepayto.me",
					],
				},
			));
		} catch (error) {
			return jsonResponse(
				{
					error: "SafePay returned an invalid payment session.",
					details:
						error instanceof Error
							? error.message
							: "Invalid checkout response.",
				},
				502,
				request,
			);
		}

		const { data: order, error: orderError } = await adminClient
			.from("payment_orders")
			.insert({
				user_id: firebaseUser.uid,
				invoice,
				provider_transaction_id: providerTransactionId,
				amount_minor: amountMinor,
				currency,
				credits_to_add: creditsToAdd,
				status: "processing",
				description,
				customer_first_name: normalizedCustomer.firstName,
				customer_last_name: normalizedCustomer.lastName,
				customer_email: normalizedCustomer.email,
				customer_phone: normalizedCustomer.phone,
				customer_country_code: normalizedCustomer.countryCode,
				customer_city: normalizedCustomer.city,
				raw_create_response: providerText,
			})
			.select("id")
			.single();

		if (orderError || !order) {
			return jsonResponse(
				{
					error: "Unable to save the payment session.",
					details: orderError?.message,
				},
				500,
				request,
			);
		}

		return jsonResponse(
			{ paymentId: order.id, invoice, checkoutUrl },
			200,
			request,
		);
	} catch (error) {
		return jsonResponse(
			{ error: error instanceof Error ? error.message : "Unknown error." },
			500,
			request,
		);
	}
});
