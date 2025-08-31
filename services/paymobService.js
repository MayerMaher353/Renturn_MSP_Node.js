const axios = require("axios");
const { decrypt } = require("../utils/crypto");
const BASE = "https://accept.paymob.com";

async function getAuthToken(encryptedApiKey) {
  const apiKey = decrypt(encryptedApiKey);
  const resp = await axios.post(`${BASE}/api/auth/tokens`, { api_key: apiKey });
  return resp.data.token; 
}



async function registerOrder(authToken, amountCents, merchantOrderId, items = []) {
  const resp = await axios.post(`${BASE}/api/ecommerce/orders`, {
    auth_token: authToken,
    delivery_needed: "false",
    amount_cents: amountCents,
    currency: "EGP",
    merchant_order_id: String(merchantOrderId),
    items
  });
  return resp.data.id; 
}


async function generatePaymentKey(authToken, paymobOrderId, amountCents, billingData, integrationId) {
  const resp = await axios.post(`${BASE}/api/acceptance/payment_keys`, {
    auth_token: authToken,
    amount_cents: amountCents,
    expiration: 3600,
    order_id: paymobOrderId,
    billing_data: billingData,
    currency: "EGP",
    integration_id: Number(integrationId),
  });
  return resp.data.token; 
}
function getIframeUrl(iframeId, paymentToken) {
  return `${BASE}/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`;
}

module.exports = { getAuthToken, registerOrder, generatePaymentKey, getIframeUrl };


