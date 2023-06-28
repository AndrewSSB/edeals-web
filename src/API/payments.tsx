import axios from "axios";
import { ApiUrls } from "./Routes";
import instance from "./instance";

export interface PaymentIntentProps {
  shoppingSessionId: number;
}

export const createPaymentIntent = async (amount: number, value?: number) => {
  const response = await axios.post(
    `${ApiUrls.paymentIntent}`,
    { shoppingSessionId: value, amount: amount },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};
