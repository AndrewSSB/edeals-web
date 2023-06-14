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

export interface ProductCardProps {
  showQuantity: boolean;
  quantity?: number;
  product: Product;
  cartItemId: number | string;
  isBasket: boolean;
}
export const LittleProductCard = (props: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { setShoppingSession, setFavorites } = useContext(ProductContext);

  const removeCartItem = async (id: number | string) => {
    if (props.isBasket) {
      await deleteCartItem(id);

      try {
        const response = await getShoppingSession(1000);

        const responseData = response.data.responseData;
        setShoppingSession(responseData);
      } catch (error: any) {
        setShoppingSession({ shoppingSessionId: 0, cartItems: [], total: 0 });
        console.error("Failed to fetch favorites", error);
      }
    } else {
      await deleteFavorites(id);

      try {
        const response = await getFavorites();

        const responseData = response.data.responseData;

        setFavorites(responseData);
      } catch (error: any) {
        setFavorites([]);
        console.error("Failed to fetch favorites", error);
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
        height: "60px",
        width: "300px",
        display: "flex",
        margin: "5px 0px",
      }}
    >
      <CardImage style={{ marginLeft: "10px" }}>
        <img
          src={props.product.images.mainImage}
          alt={props.product.name}
          style={{ width: "60px", height: "60px", objectFit: "contain" }}
        />
      </CardImage>
      <CardContent
        style={{
          marginLeft: "60px",
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
            maxWidth: "120px",
          }}
        >
          {props.product.shortDescription}
        </ProductDescription>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "-25px",
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
                marginLeft: "5px",
                fontWeight: "bold",
                color: "#646FCB",
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
                width: "25px",
                height: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                right: "30px",
                left: "auto",
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
