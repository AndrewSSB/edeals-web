import { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./Checkout";
import { createPaymentIntent } from "../../API/payments";
import "./Payment.css";
import { useParams } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51NHtSfG4Hk7olvlPhiMdV5X5pVGbGwREM0BVJVj91T6rag6yyHkWqzV0nNyVG9XIvDGVrxsdcLL5fxvWVvNXRSAE00Y6wwGRTq"
);

export default function Payment() {
  const [clientSecret, setClientSecret] = useState<string>("");
  const { shopingSessionId } = useParams();

  useEffect(() => {
    console.log(shopingSessionId);

    const createPayment = async () => {
      try {
        console.log(shopingSessionId);
        if (shopingSessionId) {
          const response = await createPaymentIntent(
            shopingSessionId as unknown as number
          );
          const responseData = response.data.responseData;
          setClientSecret(responseData.clientSecret);
        }
      } catch (error: any) {
        console.error("Failed to fetch client secret:", error);
      }
    };

    createPayment();
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
  };

  return (
    <div className="Payment">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}
