import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { createHash, randomUUID } from "crypto";

admin.initializeApp();
const db = admin.firestore();

const SAFEPAY_MERCHANT_ID = defineSecret("SAFEPAY_MERCHANT_ID");
const SAFEPAY_MERCHANT_SECRET = defineSecret("SAFEPAY_MERCHANT_SECRET");

const GATEWAY_URL = "https://www.safepayto.me/new/gateway/";

// ─── SafePay utilities ────────────────────────────────────────────────────────

interface CurrencyConfig {
  minorUnitScale: number;
  minAmountMinor: number;
  maxAmountMinor: number;
  creditsPerMajorUnit: number;
}

const CURRENCIES: Record<string, CurrencyConfig> = {
  EUR: { minorUnitScale: 100, minAmountMinor: 100, maxAmountMinor: 2000000, creditsPerMajorUnit: 100 },
  GBP: { minorUnitScale: 100, minAmountMinor: 100, maxAmountMinor: 2000000, creditsPerMajorUnit: 117 },
};

function amountMajorToMinor(amount: unknown, currency: string): number {
  const str = String(amount ?? "").trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(str) || Number(str) === 0) {
    throw new Error("Enter a valid amount with up to 2 decimal places.");
  }
  const cfg = CURRENCIES[currency];
  if (!cfg) throw new Error(`Unsupported currency: ${currency}`);
  const [whole, frac = ""] = str.split(".");
  const minor =
    parseInt(whole, 10) * cfg.minorUnitScale + parseInt(frac.padEnd(2, "0"), 10);
  if (minor < cfg.minAmountMinor || minor > cfg.maxAmountMinor) {
    throw new Error(`Amount out of range for ${currency}.`);
  }
  return minor;
}

function creditsFromMinorAmount(amountMinor: number, currency: string): number {
  const cfg = CURRENCIES[currency];
  if (!cfg) throw new Error(`Unsupported currency: ${currency}`);
  return Math.floor((amountMinor * cfg.creditsPerMajorUnit) / cfg.minorUnitScale);
}

function md5(value: string): string {
  return createHash("md5").update(value).digest("hex");
}

function buildPaymentHash(params: {
  amountMinor: number;
  currency: string;
  merchantId: string;
  merchantSecret: string;
}): string {
  return md5(`${params.amountMinor}${params.currency}${params.merchantId}${params.merchantSecret}`);
}

function buildRequestHash(params: {
  invoice: string;
  merchantId: string;
  merchantSecret: string;
}): string {
  return md5(`${params.invoice}${params.merchantId}${params.merchantSecret}`);
}

function buildInvoice(prefix: string, userId: string): string {
  const userPrefix = userId ? userId.slice(0, 8) : "guest";
  return `${prefix}-${userPrefix}-${randomUUID()}`;
}

const ALLOWED_CHECKOUT_HOSTS = new Set([
  "www.safepayto.me",
  "safepayto.me",
  "loyalty.safepayto.me",
]);

function parseCreatePaymentResponse(
  responseText: string,
): { checkoutUrl: string; providerTransactionId: string } {
  const lines = String(responseText ?? "")
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const [statusLine, checkoutUrl] = lines;
  if (statusLine !== "OK" || !checkoutUrl) {
    throw new Error("Unexpected SafePay create-payment response.");
  }
  const url = new URL(checkoutUrl);
  if (
    url.protocol !== "https:" ||
    !ALLOWED_CHECKOUT_HOSTS.has(url.hostname.toLowerCase())
  ) {
    throw new Error("SafePay returned an unexpected checkout URL.");
  }
  const transParam = url.searchParams.get("trans_id") ?? "";
  const [, providerTransactionId = ""] = transParam.split(",");
  if (!providerTransactionId) {
    throw new Error("SafePay response did not include a transaction id.");
  }
  return { checkoutUrl, providerTransactionId };
}

const FAILURE_HINTS = /(fail|declin|cancel|reject|chargeback|refund|void|expire)/i;
const PROCESSING_STATUS_IDS = new Set([0, 10, 11]);

type PaymentStatus = "processing" | "completed" | "failed" | "manual_review";

function classifyPaymentState(
  statusId: number | null,
  providerStatusText: string,
): PaymentStatus {
  if (statusId === 1) return "completed";
  if (statusId !== null && PROCESSING_STATUS_IDS.has(statusId)) return "processing";
  if (FAILURE_HINTS.test(providerStatusText)) return "failed";
  return "manual_review";
}

// ─── Firestore document shape ─────────────────────────────────────────────────

interface CustomerProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  city: string;
}

interface PaymentOrder {
  uid: string;
  invoice: string;
  providerTransactionId: string;
  amountMinor: number;
  currency: string;
  creditsToAdd: number;
  status: PaymentStatus;
  description: string;
  customer: CustomerProfile;
  rawCreateResponse: string;
  rawStatusResponse: unknown;
  createdAt: string;
  lastCheckedAt: string;
  completedAt: string | null;
}

// ─── Cloud Functions ──────────────────────────────────────────────────────────

export const createPaymentSession = onCall(
  { secrets: [SAFEPAY_MERCHANT_ID, SAFEPAY_MERCHANT_SECRET] },
  async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Must be signed in.");

    const uid = request.auth.uid;
    const email = request.auth.token.email ?? "";
    const body = request.data as {
      amount: string;
      currency: string;
      customer: Record<string, string>;
    };

    const currency = String(body?.currency ?? "").toUpperCase();
    const merchantId = SAFEPAY_MERCHANT_ID.value();
    const merchantSecret = SAFEPAY_MERCHANT_SECRET.value();

    let amountMinor: number;
    let creditsToAdd: number;

    try {
      amountMinor = amountMajorToMinor(body?.amount, currency);
      creditsToAdd = creditsFromMinorAmount(amountMinor, currency);
    } catch (err) {
      throw new HttpsError(
        "invalid-argument",
        err instanceof Error ? err.message : "Invalid amount or currency.",
      );
    }

    const rawCustomer = body?.customer ?? {};
    const customer: CustomerProfile = {
      firstName: String(rawCustomer.firstName ?? "").trim(),
      lastName: String(rawCustomer.lastName ?? "").trim(),
      email: String(rawCustomer.email ?? email ?? "")
        .trim()
        .toLowerCase(),
      phone: String(rawCustomer.phone ?? "").trim(),
      countryCode: String(rawCustomer.countryCode ?? "").trim().toUpperCase(),
      city: String(rawCustomer.city ?? "").trim(),
    };

    const missingFields = (
      ["firstName", "lastName", "email", "phone", "countryCode", "city"] as const
    ).filter((f) => !customer[f]);
    if (missingFields.length > 0) {
      throw new HttpsError(
        "invalid-argument",
        `Missing billing fields: ${missingFields.join(", ")}`,
      );
    }

    const invoice = buildInvoice("LUX", uid);
    const description = `LuxuryUI credit top-up (${creditsToAdd} credits)`;

    const payload = new URLSearchParams({
      _cmd: "payment",
      merchant_id: merchantId,
      amount: String(amountMinor),
      currency,
      invoice,
      language: "ENG",
      cl_fname: customer.firstName,
      cl_lname: customer.lastName,
      cl_email: customer.email,
      cl_phone: customer.phone,
      cl_country: customer.countryCode,
      cl_city: customer.city,
      description,
      psys: "",
      get_trans: "1",
      hash: buildPaymentHash({ amountMinor, currency, merchantId, merchantSecret }),
    });

    const providerRes = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload,
    });
    const providerText = await providerRes.text();

    if (!providerRes.ok) {
      throw new HttpsError(
        "internal",
        `SafePay rejected the payment session request. (${providerRes.status})`,
      );
    }

    let checkoutUrl: string;
    let providerTransactionId: string;

    try {
      ({ checkoutUrl, providerTransactionId } = parseCreatePaymentResponse(providerText));
    } catch (err) {
      const safeText = providerText.slice(0, 400);
      throw new HttpsError(
        "internal",
        `SafePay response parse error: ${err instanceof Error ? err.message : "unknown"}. Raw (truncated): ${safeText}`,
      );
    }

    const now = new Date().toISOString();
    const order: PaymentOrder = {
      uid,
      invoice,
      providerTransactionId,
      amountMinor,
      currency,
      creditsToAdd,
      status: "processing",
      description,
      customer,
      rawCreateResponse: providerText,
      rawStatusResponse: null,
      createdAt: now,
      lastCheckedAt: now,
      completedAt: null,
    };

    await db.collection("paymentOrders").doc(invoice).set(order);

    return { paymentId: providerTransactionId, invoice, checkoutUrl };
  },
);

export const refreshPaymentStatus = onCall(
  { secrets: [SAFEPAY_MERCHANT_ID, SAFEPAY_MERCHANT_SECRET] },
  async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Must be signed in.");

    const uid = request.auth.uid;
    const { invoice } = request.data as { invoice: string };

    if (!invoice) throw new HttpsError("invalid-argument", "Invoice is required.");

    const orderRef = db.collection("paymentOrders").doc(invoice);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) throw new HttpsError("not-found", "Payment order not found.");

    const order = orderSnap.data() as PaymentOrder;

    if (order.uid !== uid) throw new HttpsError("permission-denied", "Access denied.");

    const eurAmount = order.currency === "EUR" ? order.amountMinor / 100 : 0;
    const gbpAmount = order.currency === "GBP" ? order.amountMinor / 100 : 0;

    // Already terminal — return cached result without hitting SafePay
    if (order.status === "completed" || order.status === "failed") {
      return { invoice, status: order.status, credits: order.creditsToAdd, eurAmount, gbpAmount };
    }

    const merchantId = SAFEPAY_MERCHANT_ID.value();
    const merchantSecret = SAFEPAY_MERCHANT_SECRET.value();

    const payload = new URLSearchParams({
      _cmd: "request",
      merchant_id: merchantId,
      invoice,
      hash: buildRequestHash({ invoice, merchantId, merchantSecret }),
      output: "json",
    });

    const providerRes = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload,
    });
    const providerText = await providerRes.text();

    let providerJson: Record<string, unknown>;

    try {
      providerJson = JSON.parse(providerText);
    } catch {
      // Unparseable — treat as still processing
      return {
        invoice,
        status: "processing" as PaymentStatus,
        credits: order.creditsToAdd,
        eurAmount,
        gbpAmount,
      };
    }

    if (!providerRes.ok || providerJson.error_code) {
      await orderRef.update({
        lastCheckedAt: new Date().toISOString(),
        rawStatusResponse: providerJson,
      });
      return { invoice, status: order.status, credits: order.creditsToAdd, eurAmount, gbpAmount };
    }

    const statusId = Number.isInteger(Number(providerJson.status_id))
      ? Number(providerJson.status_id)
      : null;
    const providerStatusText = String(providerJson.payment_system_status ?? "");
    const newStatus = classifyPaymentState(statusId, providerStatusText);
    const now = new Date().toISOString();

    await orderRef.update({
      status: newStatus,
      rawStatusResponse: providerJson,
      lastCheckedAt: now,
      ...(newStatus === "completed" && !order.completedAt ? { completedAt: now } : {}),
    });

    // Apply credits server-side when payment completes — idempotent via topUp doc check
    if (newStatus === "completed") {
      const walletRef = db.collection("wallets").doc(uid);
      const topUpId = `safepay_${invoice.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
      const topUpRef = walletRef.collection("topUps").doc(topUpId);
      const transactionId = `safepay_txn_${topUpId}`;
      const txRef = walletRef.collection("transactions").doc(transactionId);

      await db.runTransaction(async (t) => {
        const [walletSnap, topUpSnap] = await Promise.all([
          t.get(walletRef),
          t.get(topUpRef),
        ]);

        // Idempotency: skip if credits were already applied
        if (topUpSnap.exists) return;

        const wallet = walletSnap.exists
          ? walletSnap.data()!
          : { userId: uid, balance: 0, lifetimePurchased: 0, lifetimeSpent: 0, createdAt: now, updatedAt: now };

        const nextTopUp = {
          id: topUpId,
          userId: uid,
          creditsPurchased: order.creditsToAdd,
          eurAmount,
          gbpAmount,
          stripeSessionId: invoice,
          status: "succeeded",
          createdAt: now,
        };
        const nextTx = {
          id: transactionId,
          userId: uid,
          type: "topup",
          creditsDelta: order.creditsToAdd,
          relatedOrderId: topUpId,
          createdAt: now,
        };

        t.set(walletRef, {
          ...wallet,
          balance: (wallet.balance ?? 0) + order.creditsToAdd,
          lifetimePurchased: (wallet.lifetimePurchased ?? 0) + order.creditsToAdd,
          updatedAt: now,
        });
        t.set(topUpRef, nextTopUp);
        t.set(txRef, nextTx);
      });
    }

    return { invoice, status: newStatus, credits: order.creditsToAdd, eurAmount, gbpAmount };
  },
);
