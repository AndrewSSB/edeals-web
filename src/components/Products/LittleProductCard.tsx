import { Card, CardContent } from "@mui/material";
import { Product, ProductContext } from "../../context/ProductsContext";
import { CardImage, CardWrapper, ProductDescription } from "./ProductElements";
import { useState, useContext } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import {
  deleteCartItem,
  deleteFavorites,
  getFavorites,
  getShoppingSession,
} from "../../API/products";
import { UserContext } from "../../context/UserContext";
import { DeleteProductsFromLocalStorage } from "../../hooks/SetItemsToLocalStorage";

export interface ProductCardProps {
  showQuantity: boolean;
  quantity?: number;
  product: Product;
  cartItemId: number | string;
  isBasket: boolean;
}
export const LittleProductCard = (props: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { shoppingSession, setShoppingSession, favorites, setFavorites } =
    useContext(ProductContext);
  const { isAuthenticated } = useContext(UserContext);

  const removeCartItem = async (id: number | string) => {
    if (props.isBasket) {
      const localCartItems = shoppingSession.cartItems.filter(
        (prod) => prod.productId !== props.product.productId
      );
      if (isAuthenticated) {
        try {
          await deleteCartItem(id);

          const response = await getShoppingSession(1000);

          const responseData = response.data.responseData;
          setShoppingSession(responseData);
        } catch (error: any) {
          setShoppingSession({ shoppingSessionId: 0, cartItems: [], total: 0 });
          console.error("Failed to fetch favorites", error);
        }
      } else {
        setShoppingSession({
          total: +localCartItems
            .reduce((accumulator, item) => {
              return accumulator + +item.productPrice * item.quantity;
            }, 0)
            .toFixed(2),
          shoppingSessionId: 0,
          cartItems: localCartItems,
        });
        DeleteProductsFromLocalStorage({
          keyName: "cartItems",
          productId: props.product.productId,
        });
      }
    } else {
      const localFavorites = favorites.filter(
        (product) => product.productId != props.product.productId
      );

      if (isAuthenticated) {
        await deleteFavorites(id);

        try {
          const response = await getFavorites();

          const responseData = response.data.responseData;

          setFavorites(responseData);
        } catch (error: any) {
          setFavorites([]);
          console.error("Failed to fetch favorites", error);
        }
      } else {
        setFavorites(localFavorites);

        DeleteProductsFromLocalStorage({
          keyName: "favorite",
          productId: props.product.productId,
        });
      }
    }
  };

  return (
    <Card
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      style={{
        border: "none",
        boxShadow: isHovered ? "0px 0px 10px rgba(100, 111, 203, 0.4)" : "none",
        height: "100px",
        width: "390px",
        display: "flex",
        margin: "5px 0px",
      }}
    >
      <CardImage
        style={{
          marginLeft: "10px",
          width: "40px",
          height: "40px",
        }}
      >
        <img
          src={props.product.images.mainImage}
          alt={props.product.name}
          style={{
            width: "80px",
            height: "80px",
          }}
        />
      </CardImage>
      <CardContent
        style={{
          marginLeft: "45px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        }}
      >
        <ProductDescription
          variant="h6"
          style={{
            fontSize: "12px",
            paddingLeft: "2px",
            width: "160px",
          }}
        >
          {props.product.shortDescription}
        </ProductDescription>
        <div
          style={{ width: "40%", display: "flex", justifyContent: "flex-end" }}
        >
          <div
            style={{
              marginTop: "-30px",
              marginRight: "-20px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {props.showQuantity && (
              <ProductDescription
                variant="h6"
                style={{ fontSize: "12px", color: "gray" }}
              >
                x{props.quantity}
              </ProductDescription>
            )}
            <ProductDescription
              variant="h6"
              style={{
                fontSize: "12px",
                marginLeft: "-5px",
                fontWeight: "bold",
                color: "#646FCB",
                width: "80px",
                display: "flex",
                marginRight: "20px",
                justifyContent: "flex-end",
              }}
            >
              {props.product.price} Lei
            </ProductDescription>
          </div>
          {isHovered && (
            <div
              onClick={() => removeCartItem(props.cartItemId)}
              style={{
                position: "absolute",
                width: "30px",
                height: "30px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                right: "42px",
                marginTop: "10px",
                backgroundColor: "#dbe1ff",
              }}
            >
              <ClearIcon />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
