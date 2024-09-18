import { headers } from 'next/headers'
import { NextResponse } from "next/server";
const { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY } = process.env;
const base = "https://api-m.sandbox.paypal.com";

const WEBHOOK_ID = '7Y879133UU3491006';

export async function POST(req: Request) {
const transmission_id = headers().get("paypal-transmission-id");
const transmission_time = headers().get("paypal-transmission-time");
const cert_url = headers().get("paypal-cert-url");
const transmission_sig =  headers().get("paypal-transmission-sig")
const auth_algo =headers().get("paypal-auth-algo");
const webhook_id = '7Y879133UU3491006';
const webhook_event = await req.text();

const url = `${base}/v1/notifications/verify-webhook-signature`
const payload = {
    transmission_id:transmission_id,
    transmission_time:transmission_time,
    cert_url:cert_url,
    auth_algo:auth_algo,
    transmission_sig:transmission_sig,
    webhook_id:webhook_id,
    webhook_event:webhook_event}

    console.log("payload",payload)

try {
    const accessToken = await capture();
    const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
    
        },
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("data",data)
} catch (error) {
    console.log("error",error)
}

return NextResponse.json({
    status: 200,
    message: "webhook received",
  })
}

  // Calculez la signature de la requête



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

// export async function POST(req:Request){
//     const transmissionId = headers().get("paypal-transmission-id");
//     const timeStamp = headers().get("paypal-transmission-time");
//     const paypalcerturl = headers().get("paypal-cert-url");
//     const paypaltxsig =  headers().get("paypal-transmission-sig")
//     const event =  await req.text()
    
//     const crc = parseInt("0x" + crc32(event).toString());
//     const message = `${transmissionId}|${timeStamp}|${WEBHOOK_ID}|${crc}`
//     const certPem = await downloadAndCache(paypalcerturl!);
//     const signatureBuffer = Buffer.from(paypaltxsig!, 'base64');
//     const verifier = crypto.createVerify('SHA256');
//     verifier.update(message);
//     //const isvalid= verifier.verify(certPem, signatureBuffer);

//     try {
//         verifier.verify(certPem, signatureBuffer);
//     } catch (error) {
//         console.log("error",error)
//     }
//  //   console.log("isvalid",isvalid)

//     // if(isvalid){
//     //     console.log("signature is valid")
//     // }else{
//     //     console.log("signature not valid")
//     // }

   

//   return NextResponse.json({message:"webhook received"})
// }

// async function downloadAndCache(url:string) {
//     // Download the file if not cached
//     const response = await fetch(url);
//     const data = await response.text()   
//     return data;
//   }

