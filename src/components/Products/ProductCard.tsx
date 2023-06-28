import { Card, CardContent, Grid, Rating } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  CartItem,
  Product,
  ProductContext,
  ShoppingSession,
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
import { UserContext } from "../../context/UserContext";
import {
  GetProductsFromLocalStorage,
  SetProductsToLocalStorage,
} from "../../hooks/SetItemsToLocalStorage";
import { calculateAverageRating } from "../ProductDetails/ProductDetails";

type ProductCardProps = {
  product: Product;
};

export const handleCartItems = async (
  _quantity: number,
  product: Product,
  isAuthenticated: boolean,
  shoppingSession: ShoppingSession,
  setShoppingSession: (value: ShoppingSession) => void
) => {
  if (isAuthenticated) {
    try {
      await addCartItems({ quantity: _quantity, productId: product.productId });

      const response = await getShoppingSession(1000);

      const responseData = response.data.responseData;

      setShoppingSession(responseData);
    } catch (error) {
      console.error("Failed to add / fetch cart items");
    }
  } else {
    shoppingSession.total = +shoppingSession.cartItems
      .reduce((accumulator, item) => {
        return accumulator + +item.productPrice * item.quantity;
      }, 0)
      .toFixed(2);

    setShoppingSession(shoppingSession);

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
        shoppingSessionId: 0,
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

export const handleFavorites = async (
  product: Product,
  favorites: Product[],
  setFavorites: (value: Product[]) => void,
  isAuthenticated: boolean
) => {
  const favorite = favorites.find((prd) => prd.productId === product.productId);
  if (isAuthenticated) {
    try {
      if (!favorite) {
        await addFavorites({ productId: product.productId });
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

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState<Boolean>(false);
  const { shoppingSession, setShoppingSession, favorites, setFavorites } =
    useContext(ProductContext);
  const { isAuthenticated } = useContext(UserContext);

  const navigate = useNavigate();

  const handleProductDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Grid item xs={8} sm={4} md={3} lg={2}>
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
          style={{ cursor: "pointer", height: "100%", paddingBottom: "0" }}
        >
          <div onClick={() => handleProductDetails(product.productId)}>
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
                value={calculateAverageRating(product)}
                precision={0.2}
                readOnly
                style={{ fontSize: "18px", marginTop: "10px" }}
              />
            </CardContent>
          </div>

          <CardContent
            style={{
              marginTop: "50px",
              width: "100%",
              paddingLeft: "0",
              paddingBottom: "0",
            }}
          >
            <div style={{ border: "1px solid #e0e0e0", width: "auto" }} />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                height: "40px",
                paddingTop: "10px",
                paddingLeft: "5px",
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
              <NoHoverIconButton
                onClick={() =>
                  handleFavorites(
                    product,
                    favorites,
                    setFavorites,
                    isAuthenticated
                  )
                }
              >
                <FavoriteIcon sx={{ color: "#646FCB" }} />
              </NoHoverIconButton>
              <NoHoverIconButton
                onClick={() =>
                  handleCartItems(
                    1,
                    product,
                    isAuthenticated,
                    shoppingSession,
                    setShoppingSession
                  )
                }
              >
                <ShoppingCartIcon sx={{ color: "#646FCB" }} />
              </NoHoverIconButton>
            </div>
          </CardContent>
        </CardWrapper>
      </Card>
    </Grid>
  );
};
