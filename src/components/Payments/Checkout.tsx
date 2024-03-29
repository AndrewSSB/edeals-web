import React, { useContext, useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Stripe,
  StripePaymentElementOptions,
  PaymentIntentResult,
  StripeLinkAuthenticationElementChangeEvent,
} from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { createOrder } from "../../API/products";

interface CheckoutFormProps {
  clientSecret: string;
}

export default function CheckoutForm({
  clientSecret,
}: CheckoutFormProps): JSX.Element {
  const stripe = useStripe() as Stripe;
  const elements = useElements();

  const { userData, order } = useContext(UserContext);
  const [message, setMessage] = useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(userData.email);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent, error }: PaymentIntentResult) => {
        if (paymentIntent) {
          switch (paymentIntent.status) {
            case "succeeded":
              setMessage("Payment succeeded!");
              break;
            case "processing":
              setMessage("Your payment is processing.");
              break;
            case "requires_payment_method":
              setMessage("Your payment was not successful, please try again.");
              break;
            default:
              setMessage("Something went wrong.");
              break;
          }
        } else if (error) {
          setMessage("An unexpected error occurred.");
        }
      });
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://${process.env.REACT_APP_APP_URL}`,
        receipt_email: email,
      },
    });

    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
    defaultValues: { billingDetails: { email: email } },
  };

  useEffect(() => {
    document.body.classList.add("checkout-screen");
    return () => {
      document.body.classList.remove("checkout-screen");
    };
  }, []);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  console.log(order);

  const confirmOrder = async (orderId: number) => {
    try {
      await createOrder(orderId);
      if (!localStorage.getItem("accessToken")) {
        localStorage.removeItem("cartItems");
      }
    } catch (ex: any) {
      console.error(ex);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(event: StripeLinkAuthenticationElementChangeEvent) =>
          setEmail(event.value.email)
        }
      />
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <button type="button" id="submit" onClick={handleBack}>
          <span id="button-text">Întoarce-te</span>
        </button>
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          onClick={() => confirmOrder(order.orderId)}
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Plătește"
            )}
          </span>
        </button>
      </div>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
