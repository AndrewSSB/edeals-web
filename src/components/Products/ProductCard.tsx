import { Card, CardContent, Grid, Rating } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Product, ProductContext } from "../../context/ProductsContext";
import { CardImage, CardWrapper, ProductDescription } from "./ProductElements";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { NoHoverIconButton } from "../Navbar/NavbarElements";
import { useContext, useState } from "react";
import {
  addCartItems,
  addFavorites,
  getCartItems,
  getFavorites,
  getShoppingSession,
} from "../../API/products";

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState<Boolean>(false);
  const { setShoppingSession, setFavorites } = useContext(ProductContext);

  const handleFavorites = async (value: string) => {
    try {
      await addFavorites({ productId: value });

      const response = await getFavorites();

      const responseData = response.data.responseData;

      setFavorites(responseData);
    } catch (error: any) {
      console.error("Failed to add / fetch favorite products");
    }
  };

  const handleCartItems = async (_quantity: number, _productId: string) => {
    try {
      await addCartItems({ quantity: _quantity, productId: _productId });

      const response = await getShoppingSession(1000);

      const responseData = response.data.responseData;

      setShoppingSession(responseData);
    } catch (error) {
      console.error("Failed to add / fetch cart items");
    }
  };

  return (
    <Grid item xs={6} sm={6} md={2} lg={2}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          border: "none",
          boxShadow: isHovered
            ? "0px 5px 5px rgba(100, 111, 203, 0.4)"
            : "none",
          height: "100%",
        }}
      >
        <CardWrapper style={{ cursor: "pointer" }}>
          <CardImage>
            <img src={product.images.mainImage} alt={product.name} />
          </CardImage>
          <CardContent
            style={{
              marginTop: "15px",
              maxHeight: "20px",
              paddingLeft: "0",
              minHeight: "40px",
              cursor: "pointer",
            }}
          >
            <ProductDescription
              variant="h6"
              style={{ fontSize: "15px", paddingLeft: "2px" }}
            >
              {product.shortDescription}
            </ProductDescription>
            <Rating
              name="product-rating"
              value={Math.random() * (5 - 1) + 1}
              precision={0.5}
              readOnly
              style={{ fontSize: "18px", marginTop: "10px" }}
            />
          </CardContent>
        </CardWrapper>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 10px",
          }}
        >
          <div style={{ color: "#646FCB" }}>
            <span
              style={{
                fontSize: "18px",
                fontFamily: "sans-serif",
                fontWeight: "600",
              }}
            >
              {product.price} Lei
            </span>
          </div>
          <NoHoverIconButton onClick={() => handleFavorites(product.productId)}>
            <FavoriteIcon sx={{ color: "#646FCB" }} />
          </NoHoverIconButton>
          <NoHoverIconButton
            onClick={() => handleCartItems(1, product.productId)}
          >
            <ShoppingCartIcon sx={{ color: "#646FCB" }} />
          </NoHoverIconButton>
        </div>
      </Card>
    </Grid>
  );
};
