import crypto from "crypto"
import * as crc32 from "buffer-crc32"
import { headers } from 'next/headers'
import { NextResponse } from "next/server";


const WEBHOOK_ID = '7Y879133UU3491006';

export async function POST(req:Request){
    const transmissionId = headers().get("paypal-transmission-id");
    const timeStamp = headers().get("paypal-transmission-time");
    const paypalcerturl = headers().get("paypal-cert-url");
    const paypaltxsig =  headers().get("paypal-transmission-sig")
    const event = await req.text()
    
    const crc = parseInt("0x" + crc32(event).toString('hex'));
    const message = `${transmissionId}|${timeStamp}|${WEBHOOK_ID}|${crc}`
    console.log("original signed message",message)
    const certPem = await downloadAndCache(paypalcerturl!);
    const signatureBuffer = Buffer.from(paypaltxsig!, 'base64');
    const verifier = crypto.createVerify('SHA256');
    verifier.update(message);
    const isvalid= verifier.verify(certPem, signatureBuffer);

    if(isvalid){
        console.log("signature is valid")
    }else{
        console.log("signature not valid")
    }

   

  return NextResponse.json({message:"webhook received"})
}

async function downloadAndCache(url:string) {
    // Download the file if not cached
    const response = await fetch(url);
    const data = await response.text()   
    return data;
  }


// const bodyParser = require('body-parser');
// const crypto = require('crypto');

// const app = express();
// const webhookSecret = 'your_secret_key';

// app.use(bodyParser.json());

// app.post('/paypal-webhook', (req, res) => {
//   const rawBody = JSON.stringify(req.body);
//   const signature = req.headers['paypal-transmission-id'];

//   const verified = crypto.createHmac('sha256', webhookSecret)
//                        .update(rawBody)
//                        .digest('hex');

//   if (signature === verified) {
//     // Process the webhook payload
//     console.log('Webhook received:', req.body);
//     // Your course fulfillment logic here

//     res.status(200).send('Webhook received successfully.');
//   } else {
//     console.error('Webhook verification failed.');
//     res.status(403).send('Unauthorized');
//   }
// });

// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });