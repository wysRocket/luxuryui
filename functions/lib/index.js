"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshPaymentStatus = exports.createPaymentSession = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const crypto_1 = require("crypto");
admin.initializeApp();
const db = admin.firestore();
const SAFEPAY_MERCHANT_ID = (0, params_1.defineSecret)("SAFEPAY_MERCHANT_ID");
const SAFEPAY_MERCHANT_SECRET = (0, params_1.defineSecret)("SAFEPAY_MERCHANT_SECRET");
const GATEWAY_URL = "https://www.safepayto.me/new/gateway/";
const CURRENCIES = {
    EUR: { minorUnitScale: 100, minAmountMinor: 1, maxAmountMinor: 20000, creditsPerMajorUnit: 100 },
    GBP: { minorUnitScale: 100, minAmountMinor: 1, maxAmountMinor: 20000, creditsPerMajorUnit: 117 },
};
function amountMajorToMinor(amount, currency) {
    const str = String(amount !== null && amount !== void 0 ? amount : "").trim();
    if (!/^\d+(?:\.\d{1,2})?$/.test(str) || Number(str) === 0) {
        throw new Error("Enter a valid amount with up to 2 decimal places.");
    }
    const cfg = CURRENCIES[currency];
    if (!cfg)
        throw new Error(`Unsupported currency: ${currency}`);
    const [whole, frac = ""] = str.split(".");
    const minor = parseInt(whole, 10) * cfg.minorUnitScale + parseInt(frac.padEnd(2, "0"), 10);
    if (minor < cfg.minAmountMinor || minor > cfg.maxAmountMinor) {
        throw new Error(`Amount out of range for ${currency}.`);
    }
    return minor;
}
function creditsFromMinorAmount(amountMinor, currency) {
    const cfg = CURRENCIES[currency];
    if (!cfg)
        throw new Error(`Unsupported currency: ${currency}`);
    return Math.floor((amountMinor * cfg.creditsPerMajorUnit) / cfg.minorUnitScale);
}
function normalizeCountryCode(value) {
    const countryCode = String(value !== null && value !== void 0 ? value : "").trim().toUpperCase();
    return /^[A-Z]{2}$/.test(countryCode) ? countryCode : "";
}
function md5(value) {
    return (0, crypto_1.createHash)("md5").update(value).digest("hex");
}
function buildPaymentHash(params) {
    return md5(`${params.amountMinor}${params.currency}${params.merchantId}${params.merchantSecret}`);
}
function buildRequestHash(params) {
    return md5(`${params.invoice}${params.merchantId}${params.merchantSecret}`);
}
function buildInvoice(prefix, userId) {
    const userPrefix = userId ? userId.slice(0, 8) : "guest";
    return `${prefix}-${userPrefix}-${(0, crypto_1.randomUUID)()}`;
}
const ALLOWED_CHECKOUT_HOSTS = new Set([
    "www.safepayto.me",
    "safepayto.me",
    "loyalty.safepayto.me",
]);
function parseCreatePaymentResponse(responseText) {
    var _a;
    const lines = String(responseText !== null && responseText !== void 0 ? responseText : "")
        .trim()
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
    const [statusLine, checkoutUrl] = lines;
    if (statusLine !== "OK" || !checkoutUrl) {
        throw new Error("Unexpected SafePay create-payment response.");
    }
    const url = new URL(checkoutUrl);
    if (url.protocol !== "https:" ||
        !ALLOWED_CHECKOUT_HOSTS.has(url.hostname.toLowerCase())) {
        throw new Error("SafePay returned an unexpected checkout URL.");
    }
    const transParam = (_a = url.searchParams.get("trans_id")) !== null && _a !== void 0 ? _a : "";
    const [, providerTransactionId = ""] = transParam.split(",");
    if (!providerTransactionId) {
        throw new Error("SafePay response did not include a transaction id.");
    }
    return { checkoutUrl, providerTransactionId };
}
const FAILURE_HINTS = /(fail|declin|cancel|reject|chargeback|refund|void|expire)/i;
const PROCESSING_STATUS_IDS = new Set([0, 10, 11]);
function classifyPaymentState(statusId, providerStatusText) {
    if (statusId === 1)
        return "completed";
    if (statusId !== null && PROCESSING_STATUS_IDS.has(statusId))
        return "processing";
    if (FAILURE_HINTS.test(providerStatusText))
        return "failed";
    return "manual_review";
}
// ─── Cloud Functions ──────────────────────────────────────────────────────────
exports.createPaymentSession = (0, https_1.onCall)({ secrets: [SAFEPAY_MERCHANT_ID, SAFEPAY_MERCHANT_SECRET] }, async (request) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (!request.auth)
        throw new https_1.HttpsError("unauthenticated", "Must be signed in.");
    const uid = request.auth.uid;
    const email = (_a = request.auth.token.email) !== null && _a !== void 0 ? _a : "";
    const body = request.data;
    const currency = String((_b = body === null || body === void 0 ? void 0 : body.currency) !== null && _b !== void 0 ? _b : "").toUpperCase();
    const merchantId = SAFEPAY_MERCHANT_ID.value();
    const merchantSecret = SAFEPAY_MERCHANT_SECRET.value();
    let amountMinor;
    let creditsToAdd;
    try {
        amountMinor = amountMajorToMinor(body === null || body === void 0 ? void 0 : body.amount, currency);
        creditsToAdd = creditsFromMinorAmount(amountMinor, currency);
    }
    catch (err) {
        throw new https_1.HttpsError("invalid-argument", err instanceof Error ? err.message : "Invalid amount or currency.");
    }
    const rawCustomer = (_c = body === null || body === void 0 ? void 0 : body.customer) !== null && _c !== void 0 ? _c : {};
    const customer = {
        firstName: String((_d = rawCustomer.firstName) !== null && _d !== void 0 ? _d : "").trim(),
        lastName: String((_e = rawCustomer.lastName) !== null && _e !== void 0 ? _e : "").trim(),
        email: String((_g = (_f = rawCustomer.email) !== null && _f !== void 0 ? _f : email) !== null && _g !== void 0 ? _g : "")
            .trim()
            .toLowerCase(),
        phone: String((_h = rawCustomer.phone) !== null && _h !== void 0 ? _h : "").trim(),
        countryCode: normalizeCountryCode(rawCustomer.countryCode),
        city: String((_j = rawCustomer.city) !== null && _j !== void 0 ? _j : "").trim(),
    };
    const missingFields = ["firstName", "lastName", "email", "phone", "countryCode", "city"].filter((f) => !customer[f]);
    if (missingFields.length > 0) {
        throw new https_1.HttpsError("invalid-argument", `Missing billing fields: ${missingFields.join(", ")}`);
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
        throw new https_1.HttpsError("internal", `SafePay rejected the payment session request. (${providerRes.status})`);
    }
    let checkoutUrl;
    let providerTransactionId;
    try {
        ({ checkoutUrl, providerTransactionId } = parseCreatePaymentResponse(providerText));
    }
    catch (err) {
        const safeText = providerText.slice(0, 400);
        throw new https_1.HttpsError("internal", `SafePay response parse error: ${err instanceof Error ? err.message : "unknown"}. Raw (truncated): ${safeText}`);
    }
    const now = new Date().toISOString();
    const order = {
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
});
exports.refreshPaymentStatus = (0, https_1.onCall)({ secrets: [SAFEPAY_MERCHANT_ID, SAFEPAY_MERCHANT_SECRET] }, async (request) => {
    var _a;
    if (!request.auth)
        throw new https_1.HttpsError("unauthenticated", "Must be signed in.");
    const uid = request.auth.uid;
    const { invoice } = request.data;
    if (!invoice)
        throw new https_1.HttpsError("invalid-argument", "Invoice is required.");
    const orderRef = db.collection("paymentOrders").doc(invoice);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists)
        throw new https_1.HttpsError("not-found", "Payment order not found.");
    const order = orderSnap.data();
    if (order.uid !== uid)
        throw new https_1.HttpsError("permission-denied", "Access denied.");
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
    let providerJson;
    try {
        providerJson = JSON.parse(providerText);
    }
    catch (_b) {
        // Unparseable — treat as still processing
        return {
            invoice,
            status: "processing",
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
    const providerStatusText = String((_a = providerJson.payment_system_status) !== null && _a !== void 0 ? _a : "");
    const newStatus = classifyPaymentState(statusId, providerStatusText);
    const now = new Date().toISOString();
    await orderRef.update(Object.assign({ status: newStatus, rawStatusResponse: providerJson, lastCheckedAt: now }, (newStatus === "completed" && !order.completedAt ? { completedAt: now } : {})));
    // Apply credits server-side when payment completes — idempotent via topUp doc check
    if (newStatus === "completed") {
        const walletRef = db.collection("wallets").doc(uid);
        const topUpId = `safepay_${invoice.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
        const topUpRef = walletRef.collection("topUps").doc(topUpId);
        const transactionId = `safepay_txn_${topUpId}`;
        const txRef = walletRef.collection("transactions").doc(transactionId);
        await db.runTransaction(async (t) => {
            var _a, _b;
            const [walletSnap, topUpSnap] = await Promise.all([
                t.get(walletRef),
                t.get(topUpRef),
            ]);
            // Idempotency: skip if credits were already applied
            if (topUpSnap.exists)
                return;
            const wallet = walletSnap.exists
                ? walletSnap.data()
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
            t.set(walletRef, Object.assign(Object.assign({}, wallet), { balance: ((_a = wallet.balance) !== null && _a !== void 0 ? _a : 0) + order.creditsToAdd, lifetimePurchased: ((_b = wallet.lifetimePurchased) !== null && _b !== void 0 ? _b : 0) + order.creditsToAdd, updatedAt: now }));
            t.set(topUpRef, nextTopUp);
            t.set(txRef, nextTx);
        });
    }
    return { invoice, status: newStatus, credits: order.creditsToAdd, eurAmount, gbpAmount };
});
//# sourceMappingURL=index.js.map