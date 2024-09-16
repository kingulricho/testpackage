import crypto from "crypto"
import { headers } from 'next/headers'
import { NextResponse } from "next/server";


const webhookSecret = '7Y879133UU3491006';

export async function POST(req:Request){
    const signature = headers().get("paypal-transmission-id");
    const body= await req.json()
    const rawBody = JSON.stringify(body);

    const verified = crypto.createHmac('sha256', webhookSecret)
                       .update(rawBody)
                       .digest('hex');

  if (signature === verified) {
    // Process the webhook payload
    console.log('Webhook received:', body);
    // Your course fulfillment logic here

    
  } else {
    console.error('Webhook verification failed.');
    
  }

  return NextResponse.json({message:"webhook received"})
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