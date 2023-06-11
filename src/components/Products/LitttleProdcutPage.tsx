import { Grid } from "@mui/material";
import { LittleProductCard } from "./LittleProductCard";
import {
  Product,
  ProductContext,
  ShoppingSession,
} from "../../context/ProductsContext";
import React, { useContext } from "react";

interface LittlePageProps {
  showQuantity: boolean;
  favorites?: Product[] | null;
  shoppingSession?: ShoppingSession | null;
}

export const LittleProductPage = (props: LittlePageProps) => {
  const { products } = useContext(ProductContext);

  console.log(props.shoppingSession);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {props.favorites &&
        props.favorites
          .slice(0, 3)
          .map((product) => (
            <LittleProductCard
              key={product.productId}
              product={product}
              showQuantity={props.showQuantity}
              cartItemId={product.productId}
              isBasket={false}
            />
          ))}
      {props.shoppingSession &&
        props.shoppingSession.cartItems &&
        props.shoppingSession.cartItems.slice(0, 3).map((cartItem) => {
          const product = products.find(
            (product) => product.productId === cartItem.productId
          );
          if (product) {
            return (
              <LittleProductCard
                key={product.productId}
                product={product}
                showQuantity={props.showQuantity}
                cartItemId={cartItem.cartItemId}
                isBasket={true}
                quantity={cartItem.quantity}
              />
            );
          }
          return null;
        })}
    </div>
  );
};
