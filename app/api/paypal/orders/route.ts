import { NextResponse } from "next/server";
const { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY } = process.env;
const base = "https://api-m.sandbox.paypal.com";


export async function POST(request: Request){
  const {description,price} = await request.json();
  console.log("description price",description,price)

  const accessToken = await capture();
  console.log("access token",accessToken)
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    description: description,
    purchase_units: [
      {
        amount: {
          currency_code: "EUR",
          value: price,
        },
      },
    ],
  };

try{
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,

    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return NextResponse.json(data);
}catch (error) {
  console.log("Failed to create order:", error);
  return NextResponse.json({message:"something went wrong",status:500});
}

}

const capture = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_SECRET_KEY,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

