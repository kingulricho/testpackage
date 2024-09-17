import crypto from "crypto"
import crc32 from "crc/crc32"
import { headers } from 'next/headers'
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from 'next';


const WEBHOOK_ID = '7Y879133UU3491006';

export async function POST(req: Request) {
const paypal_transmission_id = headers().get("paypal-transmission-id");
const paypal_cert_url = headers().get("paypal-cert-url");
const body = await req.text();
const paypal_auth_algo =headers().get("paypal-auth-algo");

console.log("event",body)
  // Vérifiez que la requête provient bien de PayPal
  if (!paypal_transmission_id || !paypal_cert_url) {
    return NextResponse.json({
        status: 400,
        message: "missing headers",
      });
  }

  // Obtenez le certificat public de PayPal
  let cert;
  try {
    cert = await downloadAndCache(paypal_cert_url)
  } catch (error) {
    console.error('Error fetching PayPal certificate:', error);
    return NextResponse.json({
        status: 500,
        message: "error fetching paypal certificate",
      });  }

  // Calculez la signature de la requête
  const signature = crypto.createHmac('sha256', cert).update(JSON.stringify(body)).digest('hex');

  // Vérifiez si la signature correspond à la signature fournie par PayPal
  if (signature !== paypal_auth_algo) {
    return NextResponse.json({
        status: 400,
        message: "invalid paypal signature",
      });  }

  // La signature est valide
  console.log('PayPal webhook signature verified');

  // Traitez la requête
  // ...

  return NextResponse.json({
    status: 200,
    message: "webhook received",
  });}

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

async function downloadAndCache(url:string) {
    // Download the file if not cached
    const response = await fetch(url);
    const data = await response.text()   
    return data;
  }

