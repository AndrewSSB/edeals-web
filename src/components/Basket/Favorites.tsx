import { ProductProfile } from "./ProductProfile";

export const Favorites = () => {
  const favoriteFunction = () => {};

  return (
    <ProductProfile
      isInFavoritePage={false}
      isInbasketPage={true}
      favorites="Favorite"
      onClickFunction={favoriteFunction}
    />
  );
};
