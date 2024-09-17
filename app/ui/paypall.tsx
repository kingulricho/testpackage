import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

export default function Paypall() {
  const router = useRouter();

  return (
    <div className="w-full">
      <PayPalScriptProvider
        options={{
          currency: "EUR",
          clientId:
            "Aa4R-icGhvSNzYt0pxRZRlOdH1SBnR4OGLfVi5lqzGJIl9gqwY_pL_2gbDKEuurETTSlcOHLwd4tWujj",
        }}
      >
        <PayPalButtons
          style={{
            layout: "horizontal",
            color: "blue",
            label: "pay",
            height: 54,
            tagline: false,
            shape: "pill",
          }}
          createOrder={async () => {
            try {
              const response = await fetch("/api/paypal/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  description: "airtime purchase",
                  price: 100,
                }),
              });
              const order = await response.json();
              if (order.id) {
                //create prisma order
                return order.id;
              } else {
                const errorDetail = order?.details?.[0];
                const errorMessage = errorDetail
                  ? `${errorDetail.issue} ${errorDetail.description} (${order.debug_id})`
                  : JSON.stringify(order);

                throw new Error(errorMessage);
              }
            } catch (error) {
              console.error(error);
            }
          }}
          onCancel={(data) => {
            console.log("Cancelled:", data);
          }}
          onApprove={async (data, actions) => {
            try {
              const response = await fetch(`/api/paypal/orders/capture`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: data.orderID,
                }),
              });
              const order = await response.json();

              const errorDetail = order?.details?.[0];

              if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                return actions.restart();
              } else if (errorDetail) {
                throw new Error(
                  `${errorDetail.description} (${order.debug_id})`
                );
              } else {
                console.log("order paid");
                // save to database

                //redirect to thank page
                router.push("/");

                // (3) Successful transaction -> Show confirmation or thank you message
                // Or go to another URL:  actions.redirect('thank_you.html');
                const transaction =
                  order.purchase_units[0].payments.captures[0];

                console.log(
                  "Capture result",
                  order,
                  JSON.stringify(order, null, 2)
                );
              }
            } catch {}
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
