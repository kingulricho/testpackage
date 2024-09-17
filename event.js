const crc32 = require("buffer-crc32")

const event = {"id":"WH-183382197B5204815-5TH5154807900633E","event_version":"1.0","create_time":"2024-09-17T11:43:49.382Z","resource_type":"capture","resource_version":"2.0","event_type":"PAYMENT.CAPTURE.COMPLETED","summary":"Payment completed for EUR 10.0 EUR","resource":{"payee":{"email_address":"sb-439miy27021235@business.example.com","merchant_id":"XE9VUCVXN5SUQ"},"amount":{"value":"10.00","currency_code":"EUR"},"seller_protection":{"dispute_categories":["ITEM_NOT_RECEIVED","UNAUTHORIZED_TRANSACTION"],"status":"ELIGIBLE"},"supplementary_data":{"related_ids":{"order_id":"06V1662331486263K"}},"update_time":"2024-09-17T11:43:45Z","create_time":"2024-09-17T11:43:45Z","final_capture":true,"seller_receivable_breakdown":{"paypal_fee":{"value":"0.59","currency_code":"EUR"},"gross_amount":{"value":"10.00","currency_code":"EUR"},"net_amount":{"value":"9.41","currency_code":"EUR"}},"links":[{"method":"GET","rel":"self","href":"https://api.sandbox.paypal.com/v2/payments/captures/7NM03201LG308530F"},{"method":"POST","rel":"refund","href":"https://api.sandbox.paypal.com/v2/payments/captures/7NM03201LG308530F/refund"},{"method":"GET","rel":"up","href":"https://api.sandbox.paypal.com/v2/checkout/orders/06V1662331486263K"}],"id":"7NM03201LG308530F","status":"COMPLETED"},"links":[{"href":"https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-183382197B5204815-5TH5154807900633E","rel":"self","method":"GET"},{"href":"https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-183382197B5204815-5TH5154807900633E/resend","rel":"resend","method":"POST"}]}

const crc = parseInt("0x" + crc32(event).toString('hex'))

console.log(crc)