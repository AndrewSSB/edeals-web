import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Stack,
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
import { useContext, useState } from "react";
import { AutenticationButtons } from "../CustomButtons/CustomButtons";

interface ProductProfileProps {
  basket?: string;
  favorites?: string;
  isInbasketPage?: boolean;
  isInFavoritePage?: boolean;
  onClickFunction(): void;
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
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  description,
  quantity,
  price,
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
            backgroundColor: "red",
            objectFit: "contain",
          }}
          image={
            "https://edeals.blob.core.windows.net/edeals/08db6a7b-a507-4d3c-8cbc-d94fac2e14c5_Covor_0"
          }
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
              <NoHoverIconButton>
                <RemoveIcon sx={{ color: "black" }} />
              </NoHoverIconButton>

              <Typography
                variant="body1"
                sx={{ fontWeight: "600", marginTop: 1, marginBottom: "10px" }}
              >
                {quantity}
              </Typography>

              <div style={{ marginRight: "-12px" }}>
                <NoHoverIconButton>
                  <AddIcon sx={{ color: "black" }} />
                </NoHoverIconButton>
              </div>
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
                Mută în favorite
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
  shoppingSession: ShoppingSession,
  favorites: Product[]
): AllProducts[] | undefined => {
  if (!products || !shoppingSession || !favorites) {
    return undefined;
  }

  const productsWithQuantity: AllProducts[] = shoppingSession.cartItems.map(
    (cartItem) => {
      const { productId, quantity } = cartItem;
      const product = products!.find(
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

export const ProductProfile = (props: ProductProfileProps) => {
  const isAuthenticated = localStorage.getItem("accessToken") ? true : false;
  const [discount, setDiscount] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<Number | null>(null);
  const { shoppingSession, products, favorites } = useContext(ProductContext);

  const allProducts = manageProducts(products, shoppingSession, favorites);
  const transport = shoppingSession ? shoppingSession.total * 0.1 : 0;

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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ minWidth: "1000px" }}>
          {allProducts?.map((product) => (
            <ProductCard
              image={product?.product ? product?.product.images.mainImage : ""}
              description={product?.product ? product.product.description : ""}
              quantity={product.quantity}
              price={product?.product ? product.product.price : 0}
            />
          ))}
        </Box>

        {!props.isInbasketPage && (
          <Box
            sx={{
              marginLeft: "15px",
              marginRight: "15px",
              marginTop: "8px",
              backgroundColor: "white",
              borderRadius: "5px",
              width: "350px",
              height: "430px",
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
              Cost total transport: {transport} lei
            </Typography>

            <Typography
              variant="h6"
              style={{ margin: "40px 0px 0px 20px", fontWeight: "bold" }}
            >
              TOTAL: {shoppingSession ? shoppingSession.total + transport : 0}{" "}
              lei
            </Typography>
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
                onClick={props.onClickFunction}
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
              {discountPercent && (
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                  }}
                >
                  Ai aplicat o reducere de {shoppingSession.total}%
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
