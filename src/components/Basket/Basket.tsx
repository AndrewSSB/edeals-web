import { ProductProfile } from "./ProductProfile";

export const Basket = () => {
  return (
    <ProductProfile
      isInbasketPage={false}
      isInFavoritePage={true}
      basket="Coșul meu"
    />
  );
};
