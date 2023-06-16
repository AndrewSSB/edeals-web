import { ProductContext } from "../../context/ProductsContext";
import { ProductProfile } from "./ProductProfile";
import { useContext } from "react";

export const Basket = () => {
  return (
    <ProductProfile
      isInbasketPage={false}
      isInFavoritePage={true}
      basket="Coșul meu"
    />
  );
};
