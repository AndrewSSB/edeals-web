import { useState, useEffect, useContext } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./Checkout";
import { createPaymentIntent } from "../../API/payments";
import "./Payment.css";
import { useParams } from "react-router-dom";
import { ProductContext } from "../../context/ProductsContext";

const stripePromise = loadStripe(
  "pk_test_51NHtSfG4Hk7olvlPhiMdV5X5pVGbGwREM0BVJVj91T6rag6yyHkWqzV0nNyVG9XIvDGVrxsdcLL5fxvWVvNXRSAE00Y6wwGRTq"
);

export default function Payment() {
  const [clientSecret, setClientSecret] = useState<string>("");
  const { shopingSessionId } = useParams();
  const { shoppingSession, transport } = useContext(ProductContext);

  useEffect(() => {
    const createPayment = async () => {
      const reloadCount = Number(sessionStorage.getItem("reloadCount")) || 0;
      console.log(reloadCount);

      if (performance.navigation.type === PerformanceNavigation.TYPE_RELOAD) {
        if (reloadCount === 1) {
          window.location.href = "/";
        } else {
          sessionStorage.setItem("reloadCount", String(reloadCount + 1));
        }
      }

      try {
        if (shopingSessionId) {
          const amountToPay =
            shoppingSession.total -
            shoppingSession.total * (shoppingSession.discountPercent ?? 0) +
            transport.transportPrice;

          const response = await createPaymentIntent(
            amountToPay,
            shopingSessionId && +shopingSessionId != 0
              ? +shopingSessionId
              : undefined
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
