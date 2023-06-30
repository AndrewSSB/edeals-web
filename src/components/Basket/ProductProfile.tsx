import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import { Navbar } from "../Navbar/Navbar";
import { CardImage, ProductDescription } from "../Products/ProductElements";
import {
  Discount,
  Product,
  ProductContext,
  ShoppingSession,
} from "../../context/ProductsContext";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { NoHoverIconButton } from "../Navbar/NavbarElements";
import "./ProductProfile.css";
import { useContext, useEffect, useState } from "react";
import { AutenticationButtons } from "../CustomButtons/CustomButtons";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Checkout from "../Checkout/Checkout";
import { applyShoppingDiscount, getDiscount } from "../../API/products";
import { handleCartItems, handleFavorites } from "../Products/ProductCard";
import { removeCartItem } from "../Products/LittleProductCard";
import {
  DeleteProductsFromLocalStorage,
  SetProductsToLocalStorage,
} from "../../hooks/SetItemsToLocalStorage";

interface ProductProfileProps {
  basket?: string;
  favorites?: string;
  isInbasketPage?: boolean;
  isInFavoritePage?: boolean;
}

interface AllProducts {
  quantity: number;
  product?: Product;
  cartItemId: number | string;
}

interface custom {
  name: string;
}

export const TypografyCustom = (props: custom) => {
  return (
    <Typography
      style={{
        margin: "10px 15px",
        fontSize: "25px",
        fontFamily: "sans-serif",
        fontWeight: "400",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {props.name}
    </Typography>
  );
};

interface ProductCardProps {
  image: string;
  description: string;
  quantity: number;
  price: number;
  onClick?: (substract: boolean, product: Product) => void;
  removeElements?: (product: Product) => void;
  moveElements?: (product: Product) => void;
  product?: Product;
  isInBasket: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  description,
  quantity,
  price,
  isInBasket,
  onClick,
  removeElements,
  moveElements,
  product,
}) => {
  return (
    <>
      {/* <Typography> Vândut de {"seller"}</Typography> */}
      <Card
        sx={{
          boxShadow: "none",
          display: "flex",
          alignItems: "center",
          margin: "15px 15px",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            marginLeft: "15px",
            width: 200,
            height: 240,
            marginRight: 2,
            objectFit: "contain",
          }}
          image={image}
          alt="Product Image"
        />
        <div
          style={{
            marginTop: "35px",
            marginBottom: "auto",
            flex: 1,
          }}
        >
          <ProductDescription
            variant="body1"
            style={{ margin: "15px 10px 0 10px" }}
          >
            {description}
          </ProductDescription>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <CardContent
            sx={{
              flexGrow: 1,
              marginRight: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "10px",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: "600", marginTop: 1 }}
              >
                {price} Lei
              </Typography>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {isInBasket && (
                <NoHoverIconButton onClick={() => onClick!(false, product!)}>
                  <RemoveIcon sx={{ color: "black" }} />
                </NoHoverIconButton>
              )}

              <Typography
                variant="body1"
                sx={{ fontWeight: "600", marginTop: 1, marginBottom: "10px" }}
              >
                {!isInBasket ? "Cantitate: " + quantity : quantity}
              </Typography>

              {isInBasket && (
                <div style={{ marginRight: "-12px" }}>
                  <NoHoverIconButton onClick={() => onClick!(true, product!)}>
                    <AddIcon sx={{ color: "black" }} />
                  </NoHoverIconButton>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div onClick={() => removeElements!(product!)}>
                <Typography
                  variant="body1"
                  sx={{
                    marginTop: 1,
                    marginBottom: "10px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Șterge
                </Typography>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div onClick={() => moveElements!(product!)}>
                <Typography
                  variant="body1"
                  sx={{ marginTop: 1, fontSize: "14px", cursor: "pointer" }}
                >
                  Mută în {!isInBasket ? "coș" : "favorite"}
                </Typography>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </>
  );
};

const manageProducts = (
  products: Product[],
  shoppingSession: ShoppingSession
): AllProducts[] | undefined => {
  if (!shoppingSession) {
    return undefined;
  }

  const productsWithQuantity: AllProducts[] = shoppingSession.cartItems.map(
    (cartItem) => {
      const { productId, quantity, cartItemId } = cartItem;

      const product = products.find(
        (product) => product.productId === productId
      );

      return {
        quantity,
        product,
        cartItemId,
      };
    }
  );

  return productsWithQuantity;
};

interface typografyStyleProps {
  flex?: string;
  justifyContent?: string;
  width?: string;
  height?: string;
  fontWeight?: string;
  fontSize?: string;
  margin?: string;
  cursor?: string;
}

const typografyStyle = (props: typografyStyleProps) => {
  return {
    display: props.flex ? props.flex : "flex",
    justifyContent: props.justifyContent ? props.justifyContent : "center",
    fontWeight: props.width,
    fontSize: props.fontSize ? props.fontSize : "15px",
    width: props.height,
    height: props.fontWeight,
    margin: props.margin,
    cursor: props.cursor ? props.cursor : "pointer",
  };
};

export const lineStyle = {
  borderBottom: "1px solid #ccc",
  margin: "10px 20px",
};

export const ProductProfile = (props: ProductProfileProps) => {
  const isAuthenticated = localStorage.getItem("accessToken") ? true : false;
  const {
    shoppingSession,
    setShoppingSession,
    shoppingDiscount,
    setShoppingDiscount,
    products,
    favorites,
    setFavorites,
    transport,
    setTransport,
  } = useContext(ProductContext);
  const [discountCode, setDiscountCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { userData } = useContext(UserContext);
  const handleCloseSnackbar = () => {
    setError(null);
  };

  const [allProducts, setAllProducts] = useState<AllProducts[] | undefined>([]);

  const navigator = useNavigate();

  useEffect(() => {
    const getTransportDetails = async () => {
      // call the courier api
      setTransport({ transportPrice: 33.99 });
    };

    getTransportDetails();
  }, []);

  const handleDiscount = async (discountCode?: string) => {
    if (!discountCode) {
      setError("Adauga un cod pentru a obtine o reducere");
      return;
    }
    // Call the BE for the discount percentage
    if (shoppingSession.discountPercent) {
      setError("Ai aplicat deja un cod de reducere");
      return;
    }
    try {
      const response = await getDiscount(discountCode!);
      const discount = response.data.responseData;

      setShoppingDiscount(discount);

      const totalEffect = shoppingSession.total + transport.transportPrice;
      const afterDiscount =
        totalEffect - totalEffect * (discount.discountPercent / 100);

      shoppingSession.totalWithDiscount = +afterDiscount.toFixed(2);
      shoppingSession.discountPercent = discount.discountPercent;
      setShoppingSession(shoppingSession);
    } catch (e: any) {
      setError(e.response.data.errors[0].description);
      return;
    }

    if (isAuthenticated) {
      try {
        const response = await applyShoppingDiscount({
          discountCode: discountCode!,
        });
      } catch (e: any) {
        setError(e.response.data.errors[0].description);
        return;
      }
    }
  };

  const alterProductQuantity = async (substract: boolean, product: Product) => {
    if (substract) {
      await handleCartItems(
        1,
        product,
        isAuthenticated,
        shoppingSession,
        setShoppingSession
      );
    } else {
      if (isAuthenticated) {
      } else {
        // SetProductsToLocalStorage({
        //   keyName: "cartItems",
        //   product: product,
        //   addOnlyOnce: false,
        // });
      }
    }
    setAllProducts(manageProducts(products, shoppingSession));
  };

  const removeElements = async (product: Product) => {
    await removeCartItem(
      !props.isInbasketPage!,
      product,
      shoppingSession.cartItems.find((x) => x.productId === product.productId)
        ?.cartItemId!,
      isAuthenticated,
      shoppingSession,
      setShoppingSession,
      favorites,
      setFavorites
    );
  };

  const moveToFavorites = async (product: Product) => {
    await removeElements(product);

    await handleFavorites(product, favorites, setFavorites, isAuthenticated);
  };

  const moveToBasket = async (product: Product) => {
    await removeElements(product);

    await handleCartItems(
      1,
      product,
      isAuthenticated,
      shoppingSession,
      setShoppingSession
    );
  };

  useEffect(() => {
    setAllProducts(manageProducts(products, shoppingSession));
  }, [products, shoppingSession]);

  useEffect(() => {
    if (shoppingSession.cartItems.length === 0 && !props.isInbasketPage) {
      navigator("/");
    }
    if (favorites.length === 0 && !props.isInFavoritePage) {
      navigator("/");
    }
  }, [products, shoppingSession, favorites]);

  return (
    <Box
      sx={{
        backgroundColor: "#f2f2f7",
        minHeight: "100vh",
      }}
    >
      <Navbar
        isInBasketPage={props.isInFavoritePage}
        isInFavoritePage={props.isInbasketPage}
      />
      {props.basket && <TypografyCustom name={props.basket} />}
      {props.favorites && <TypografyCustom name={props.favorites} />}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          maxWidth: "1500px",
          minWidth: "600px",
          margin: "0 auto",
        }}
      >
        {!props.isInFavoritePage && (
          <Box
            sx={{
              marginLeft: "15px",
              marginRight: "15px",
              marginTop: "8px",
              backgroundColor: "white",
              borderRadius: "5px",
              minWidth: "350px",
              maxHeight: "510px",
            }}
          >
            <Typography
              variant="h6"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              Contul tău
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              {userData && userData.profileImage ? (
                <Avatar
                  alt="User Image"
                  src={userData.profileImage}
                  sx={{ width: "80px", height: "80px" }}
                />
              ) : (
                <Avatar
                  sx={{
                    bgcolor: "#646FCB",
                    color: "#fff",
                    fontSize: 36,
                    width: "80px",
                    height: "80px",
                  }}
                >
                  {userData.firstName && userData.lastName
                    ? userData.firstName?.charAt(0) +
                      userData.lastName?.charAt(0)
                    : "A"}
                </Avatar>
              )}
            </div>
            <div
              style={{ height: "25px" }}
              onClick={() => {
                if (isAuthenticated) {
                  navigator("/profile");
                }
              }}
            >
              <Typography
                variant="h6"
                style={typografyStyle({
                  margin: "10px 0 0 0",
                  cursor: "auto",
                })}
              >
                {userData.firstName && userData.lastName
                  ? userData.firstName + " " + userData.lastName
                  : "Anonymous"}
              </Typography>
            </div>
            <div style={lineStyle} />
            <Typography
              variant="h6"
              style={typografyStyle({
                margin: "15px 0 0 30px",
                justifyContent: "left",
              })}
            >
              Profil
            </Typography>
            <div style={lineStyle} />
            <Typography
              variant="h6"
              style={typografyStyle({
                margin: "15px 0 0 30px",
                justifyContent: "left",
              })}
            >
              Reduceri personale
            </Typography>
            <div style={lineStyle} />
            <Typography
              variant="h6"
              style={typografyStyle({
                margin: "15px 0 0 30px",
                justifyContent: "left",
              })}
            >
              Review-urile mele
            </Typography>
            <div style={lineStyle} />
            <Typography
              variant="h6"
              style={typografyStyle({
                margin: "15px 0 0 30px",
                justifyContent: "left",
              })}
            >
              Comenzile mele
            </Typography>
            <div style={lineStyle} />
            <Typography
              variant="h6"
              style={typografyStyle({
                margin: "15px 0 0 30px",
                justifyContent: "left",
              })}
            >
              Adresele mele
            </Typography>
            <div style={lineStyle} />
            <Typography
              variant="h6"
              style={typografyStyle({
                margin: "15px 0 0 30px",
                justifyContent: "left",
              })}
            >
              Conversațiile mele
            </Typography>
            <div style={lineStyle} />
          </Box>
        )}

        <Box sx={{ width: "1000px" }}>
          {!props.isInbasketPage
            ? allProducts?.map((product, idx) => (
                <div key={idx}>
                  <ProductCard
                    image={
                      product?.product ? product?.product.images.mainImage : ""
                    }
                    description={
                      product?.product ? product.product.description : ""
                    }
                    quantity={product.quantity}
                    price={product?.product ? product.product.price : 0}
                    isInBasket={true}
                    product={product.product}
                    onClick={alterProductQuantity}
                    removeElements={removeElements}
                    moveElements={moveToFavorites}
                  />
                </div>
              ))
            : favorites?.map((product, idx) => (
                <div key={idx}>
                  <ProductCard
                    image={product ? product?.images.mainImage : ""}
                    description={product ? product?.description : ""}
                    quantity={1}
                    price={product ? product.price : 0}
                    isInBasket={false}
                    product={product}
                    removeElements={removeElements}
                    moveElements={moveToBasket}
                  />
                </div>
              ))}
        </Box>

        {!props.isInbasketPage && (
          <Box
            sx={{
              marginLeft: "15px",
              marginRight: "15px",
              backgroundColor: "white",
              borderRadius: "5px",
              minWidth: "350px",
              height: "460px",
              maxHeight: "460px",
            }}
          >
            <Typography
              variant="h6"
              style={{ margin: "20px 0 20px 20px", fontWeight: "bold" }}
            >
              Sumar comandă
            </Typography>
            <Typography
              variant="h6"
              style={{ margin: "10px 0 0px 20px", fontSize: "15px" }}
            >
              Cost total produse: {shoppingSession.total.toFixed(2)} lei
            </Typography>
            <Typography
              variant="h6"
              style={{ margin: "0px 0 20px 20px", fontSize: "15px" }}
            >
              Cost total transport: {transport.transportPrice} lei
            </Typography>

            <Typography
              variant="h6"
              style={{ margin: "40px 0px 0px 20px", fontWeight: "bold" }}
            >
              TOTAL:{" "}
              {parseFloat(
                (shoppingSession.total + transport.transportPrice).toFixed(2)
              )}{" "}
              lei
            </Typography>
            <div style={{ height: "25px" }}>
              {(shoppingDiscount.discountPercent > 0 ||
                shoppingSession.discountPercent) && (
                <Typography
                  variant="h6"
                  style={{ margin: "0px 0px 0px 20px", fontSize: "15px" }}
                >
                  Total cu reducere:{" "}
                  {
                    +(
                      shoppingSession.total +
                      transport.transportPrice -
                      (shoppingSession.total + transport.transportPrice) *
                        (shoppingSession.discountPercent! / 100)
                    ).toFixed(2)
                  }{" "}
                  lei
                </Typography>
              )}
            </div>
            <div style={{ marginLeft: "20px" }}>
              <input
                id="discount"
                type="text"
                value={discountCode}
                placeholder="Aplică discount"
                onChange={(e) => setDiscountCode(e.target.value)}
                style={{ marginTop: "60px" }}
              />
              <button
                onClick={() => handleDiscount(discountCode)}
                id="discountButton"
                style={{ marginLeft: "15px" }}
              >
                Aplică
              </button>
            </div>
            <div
              style={{
                height: "40px",
                margin: "10px 20px",
              }}
            >
              {(shoppingDiscount.discountPercent > 0 ||
                shoppingSession.discountPercent) && (
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                  }}
                >
                  Ai aplicat o reducere de{" "}
                  {shoppingDiscount.discountPercent > 0
                    ? shoppingDiscount.discountPercent
                    : shoppingSession.discountPercent}
                  %
                </Typography>
              )}
            </div>
            <div style={{ marginLeft: "20px", marginTop: "25px" }}>
              <AutenticationButtons
                buttonText={"Continuă"}
                buttonWidth={"94%"}
                onClick={() => navigator("/checkout")}
              />
            </div>
          </Box>
        )}
      </div>
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        message={error}
        onClose={handleCloseSnackbar}
        TransitionComponent={Slide}
        TransitionProps={{ timeout: 500 }}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};
