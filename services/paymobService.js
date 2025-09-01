const axios = require("axios");
const { decrypt } = require("../utils/crypto");
const BASE = "https://accept.paymob.com";

// 1- Get Auth Token
async function getAuthToken(encryptedApiKey) {
  const apiKey = decrypt(encryptedApiKey);
  const resp = await axios.post(`${BASE}/api/auth/tokens`, { api_key: apiKey });
  return resp.data.token; 
}

// 2- Register Order
async function registerOrder(authToken, merchantOrderId, amountCents, items = []) {
  try {
    const payload = {
      auth_token: authToken,
      delivery_needed: "false",
      amount_cents: parseInt(amountCents),
      currency: "EGP",
      merchant_order_id: String(merchantOrderId), // رقم من عندك
      items: items.length > 0 ? items : [
        {
          name: "Default Item",
          amount_cents: parseInt(amountCents),
          quantity: 1,
        },
      ],
    };


    const resp = await axios.post(`${BASE}/api/ecommerce/orders`, payload);

    return resp.data; 
  } catch (err) {
    if (err.response) {
      console.error("Paymob Error Response (Register Order):", err.response.data);
    }
    throw err;
  }
}

// 3- Generate Payment Key
async function generatePaymentKey(authToken, orderId, amountCents, billingData, integrationId) {
  try {
    const payload = {
      auth_token: authToken,
      amount_cents: parseInt(amountCents),
      expiration: 3600,
      order_id: orderId, 
      billing_data: {
        apartment: "NA",
        email: billingData.email || "customer@test.com",
        floor: "NA",
        first_name: billingData.first_name || "Test",
        last_name: billingData.last_name || "User",
        phone_number: billingData.phone_number || "+201234567890",
        street: "NA",
        building: "NA",
        shipping_method: "NA",
        postal_code: "NA",
        city: billingData.city || "Cairo",
        country: billingData.country || "EG",
        state: "NA",
      },
      currency: "EGP",
      integration_id: Number(integrationId),
    };

    const resp = await axios.post(`${BASE}/api/acceptance/payment_keys`, payload);

    return resp.data.token; 
  } catch (err) {
    if (err.response) {
      console.error("Paymob Error Response (Payment Key):", err.response.data);
    }
    throw err;
  }
}

// 4- Build Iframe URL
function getIframeUrl(iFrame, paymentToken) {
  return `${BASE}/api/acceptance/iframes/${iFrame}?payment_token=${paymentToken}`;
}

module.exports = { getAuthToken, registerOrder, generatePaymentKey, getIframeUrl };
