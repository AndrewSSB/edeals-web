import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Navbar } from "../Navbar/Navbar";
import { CardImage, ProductDescription } from "../Products/ProductElements";
import {
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

interface ProductProfileProps {
  basket?: string;
  favorites?: string;
  isInbasketPage?: boolean;
  isInFavoritePage?: boolean;
}

interface AllProducts {
  quantity: number;
  product?: Product;
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
  onClick?: () => void;
  isInBasket: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  description,
  quantity,
  price,
  isInBasket,
  onClick,
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
            height: 200,
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
            style={{ margin: "0px 10px 0 10px" }}
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
                <NoHoverIconButton>
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
                  <NoHoverIconButton>
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
              <Typography
                variant="body1"
                sx={{ marginTop: 1, marginBottom: "10px", fontSize: "14px" }}
              >
                Șterge
              </Typography>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Typography
                variant="body1"
                sx={{ marginTop: 1, fontSize: "14px" }}
              >
                Mută în {!isInBasket ? "coș" : "favorite"}
              </Typography>
            </div>
            {/* <Stack direction="row" spacing={1} marginTop={1}>
              <Button variant="outlined" color="error">
                Delete
              </Button>
              <Button variant="outlined" color="primary">
                Move to Favorites
              </Button>
            </Stack> */}
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
      const { productId, quantity } = cartItem;

      const product = products.find(
        (product) => product.productId === productId
      );

      return {
        quantity,
        product,
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

const lineStyle = {
  borderBottom: "1px solid #ccc",
  margin: "10px 20px",
};

export const ProductProfile = (props: ProductProfileProps) => {
  const isAuthenticated = localStorage.getItem("accessToken") ? true : false;
  const { shoppingSession, products, favorites } = useContext(ProductContext);
  const [discount, setDiscount] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [transportPrice, setTransportPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const { userData } = useContext(UserContext);

  const allProducts = manageProducts(products, shoppingSession);

  useEffect(() => {
    setTransportPrice(
      36.99 //shoppingSession ? parseFloat((shoppingSession.total * 0.1).toFixed(2)) : 0
    );
  }, [shoppingSession]);

  useEffect(() => {
    const totalEffect = shoppingSession.total + transportPrice;
    const afterDiscount = totalEffect - totalEffect * (discountPercent / 100);
    setTotal(parseFloat(afterDiscount.toFixed(2)));
  }, [discountPercent, shoppingSession]);

  const handleDiscount = (discountCode: string) => {
    // Call the BE for the discount percentage
    setDiscountPercent(10);

    // setTotal((prevTotal) => {
    //   const afterDiscount = prevTotal - prevTotal * (discountPercent / 100);
    //   return afterDiscount;
    // });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f2f2f7",
        minHeight: "100vh",
      }}
    >
      <Navbar
        isAuthenticated={isAuthenticated}
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
          margin: "0 auto", // Center horizontally
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
                    : ""}
                </Avatar>
              )}
            </div>
            <div style={{ height: "25px" }}>
              <Typography
                variant="h6"
                style={typografyStyle({
                  margin: "10px 0 0 0",
                  cursor: "auto",
                })}
              >
                {userData.firstName + " " + userData.lastName}
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
            ? allProducts?.map((product) => (
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
                />
              ))
            : favorites?.map((product) => (
                <ProductCard
                  image={product ? product?.images.mainImage : ""}
                  description={product ? product?.description : ""}
                  quantity={1}
                  price={product ? product.price : 0}
                  isInBasket={false}
                />
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
              Cost total produse: {shoppingSession.total} lei
            </Typography>
            <Typography
              variant="h6"
              style={{ margin: "0px 0 20px 20px", fontSize: "15px" }}
            >
              Cost total transport: {transportPrice} lei
            </Typography>

            <Typography
              variant="h6"
              style={{ margin: "40px 0px 0px 20px", fontWeight: "bold" }}
            >
              TOTAL:{" "}
              {parseFloat((shoppingSession.total + transportPrice).toFixed(2))}{" "}
              lei
            </Typography>
            <div style={{ height: "25px" }}>
              {discountPercent > 0 && (
                <Typography
                  variant="h6"
                  style={{ margin: "0px 0px 0px 20px", fontSize: "15px" }}
                >
                  Total cu reducere: {total} lei
                </Typography>
              )}
            </div>
            <div style={{ marginLeft: "20px" }}>
              <input
                id="discount"
                type="text"
                value={discount}
                placeholder="Aplică discount"
                onChange={(e) => setDiscount(e.target.value)}
                style={{ marginTop: "60px" }}
              />
              <button
                onClick={() => handleDiscount(discount)}
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
              {discountPercent > 0 && (
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                  }}
                >
                  Ai aplicat o reducere de {discountPercent.toString()}%
                </Typography>
              )}
            </div>
            <div style={{ marginLeft: "20px", marginTop: "25px" }}>
              <AutenticationButtons
                buttonText={"Continuă"}
                buttonWidth={"94%"}
              />
            </div>
          </Box>
        )}
      </div>
    </Box>
  );
};
