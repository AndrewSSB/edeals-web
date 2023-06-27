import { Card, CardContent, Grid, Rating } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  CartItem,
  Product,
  ProductContext,
} from "../../context/ProductsContext";
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
import { useNavigate } from "react-router-dom";
import { ProductDetails } from "../ProductDetails/ProductDetails";
import { UserContext } from "../../context/UserContext";
import { SetProductsToLocalStorage } from "../../hooks/SetItemsToLocalStorage";

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState<Boolean>(false);
  const { shoppingSession, setShoppingSession, favorites, setFavorites } =
    useContext(ProductContext);
  const { isAuthenticated } = useContext(UserContext);

  const navigate = useNavigate();

  const handleFavorites = async (value: string) => {
    const favorite = favorites.find((product) => product.productId === value);
    if (isAuthenticated) {
      try {
        if (!favorite) {
          await addFavorites({ productId: value });
        }

        const response = await getFavorites();
        const responseData = response.data.responseData;

        setFavorites(responseData);
      } catch (error: any) {
        console.error("Failed to add / fetch favorite products");
      }
    } else {
      if (!favorite) {
        setFavorites([...favorites, product]);
      }

      SetProductsToLocalStorage({
        keyName: "favorite",
        product: product,
        addOnlyOnce: true,
      });
    }
  };

  const handleCartItems = async (_quantity: number, _productId: string) => {
    if (isAuthenticated) {
      try {
        await addCartItems({ quantity: _quantity, productId: _productId });

        const response = await getShoppingSession(1000);

        const responseData = response.data.responseData;

        setShoppingSession(responseData);
      } catch (error) {
        console.error("Failed to add / fetch cart items");
      }
    } else {
      const cartItem: CartItem = {
        productId: product.productId,
        productName: product.name,
        productPrice: product.price.toString(),
        image: product.images.mainImage,
        description: product.shortDescription,
        quantity: _quantity,
        shoppingSessionId: 0,
        cartItemId: shoppingSession.cartItems.length,
      };

      const total = +(
        shoppingSession.cartItems.reduce((accumulator, item) => {
          return accumulator + +item.productPrice * item.quantity;
        }, 0) +
        +cartItem.productPrice * cartItem.quantity
      ).toFixed(2);

      var itemIndex = shoppingSession.cartItems.findIndex(
        (prod) => prod.productId === product.productId
      );

      if (itemIndex != -1) {
        shoppingSession.cartItems[itemIndex].quantity += 1;
        shoppingSession.total +=
          +shoppingSession.cartItems[itemIndex].productPrice;
        setShoppingSession(shoppingSession);
      } else {
        setShoppingSession({
          shoppingSessionId: 1,
          cartItems: [...shoppingSession.cartItems, cartItem],
          total: total,
        });
      }

      SetProductsToLocalStorage({
        keyName: "cartItems",
        product: product,
        addOnlyOnce: false,
      });
    }
  };

  const handleProductDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Grid item xs={2} sm={2} md={3} lg={2}>
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
        <CardWrapper
          style={{ cursor: "pointer" }}
          onClick={() => handleProductDetails(product.productId)}
        >
          <CardImage>
            <img src={product.images.mainImage} alt={product.name} />
          </CardImage>
          <CardContent
            style={{
              marginTop: "15px",
              maxHeight: "20px",
              paddingLeft: "0",
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
        <div style={{ border: "1px solid #e0e0e0", width: "auto" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: "60px",
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
