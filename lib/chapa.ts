const CHAPA_BASE_URL = "https://api.chapa.co/v1";

export async function initializeChapaPayment({
  amount,
  email,
  firstName,
  lastName,
  txRef,
  callbackUrl,
  returnUrl,
}: {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  txRef: string;
  callbackUrl: string;
  returnUrl: string;
}) {
  const res = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amount.toString(),
      currency: "ETB",
      email,
      first_name: firstName,
      last_name: lastName,
      tx_ref: txRef,
      callback_url: callbackUrl,
      return_url: returnUrl,
      customization: {
        title: "Kerami Order",
        description: "Food and drink order payment",
      },
    }),
  });

  const data = await res.json();
  return data;
}

export async function verifyChapaPayment(txRef: string) {
  const res = await fetch(`${CHAPA_BASE_URL}/transaction/verify/${txRef}`, {
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    },
  });

  const data = await res.json();
  return data;
}