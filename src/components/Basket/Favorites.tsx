import { ProductProfile } from "./ProductProfile";

export const Favorites = () => {
  return (
    <ProductProfile
      isInFavoritePage={false}
      isInbasketPage={true}
      favorites="Favorite"
    />
  );
};
