import {
  Alert,
  AlertTitle,
  Grid,
  Paper,
  Slide,
  Snackbar,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import logo from "../../images/logo.png";
import { LogoImage, NoHoverIconButton } from "../Navbar/NavbarElements";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "../Navbar/SubNavbar";
import { CSSProperties, useContext, useEffect, useState } from "react";
import {
  blockUser,
  getUsers,
  getUsersAdmin,
  unblockUser,
} from "../../API/user";
import { AutenticationButtons } from "../CustomButtons/CustomButtons";
import { ProductContext } from "../../context/ProductsContext";
import { CardImage, ProductDescription } from "../Products/ProductElements";
import { deleteProduct } from "../../API/products";

export const Admin = () => {
  const navigate = useNavigate();
  const [usersInfo, setUsersInfo] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { products, setProducts } = useContext(ProductContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsersAdmin();

        const users = response.data.responseData;

        setUsersInfo(users);
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchUsers();
  }, []);

  const deleteProductAdmin = async (value: string) => {
    try {
      await deleteProduct(value);
      setProducts(products.filter((x) => x.productId !== value));
    } catch (err: any) {
      console.log(err);
    }
  };

  const blockUserAdmin = async (value: string) => {
    try {
      await blockUser(value);
    } catch (ex: any) {
      console.log(ex);
    }
  };

  const unblockUserAdmin = async (value: string) => {
    try {
      await unblockUser(value);
    } catch (ex: any) {
      console.log(ex);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F7F7",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "row",
          backgroundColor: "#646FCB",
        }}
      >
        <NoHoverIconButton
          size="large"
          edge="start"
          aria-label="logo"
          disableRipple
          onClick={() => navigate("/")}
        >
          <LogoImage src={logo} alt="Logo" />
        </NoHoverIconButton>
        <Typography
          variant="h6"
          style={{
            padding: "10px 0 10px 0",
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          Admin Dashboard
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "30px",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          style={{
            padding: "10px 0 10px 0",
            color: "black",
            display: "flex",
            alignItems: "center",
          }}
        >
          Utilizatori
        </Typography>
        <div
          className="profile-card"
          style={{
            backgroundColor: "white",
            width: "80%",
            height: "400px",
            marginTop: "20px",
            boxShadow: "0px 0px 10px rgba(100, 111, 203, 0.3)",
            overflowY: "auto",
          }}
        >
          {usersInfo.map((item, idx) => {
            return (
              <div
                key={idx}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <UserInfoCard
                  userInfo={item}
                  blockUserAdmin={blockUserAdmin}
                  unblockUserAdmin={unblockUserAdmin}
                />
              </div>
            );
          })}
        </div>
        <Typography
          variant="h6"
          style={{
            marginTop: "30px",
            padding: "10px 0 10px 0",
            color: "black",
            display: "flex",
            alignItems: "center",
          }}
        >
          Inventar
        </Typography>
        <div
          className="profile-card"
          style={{
            backgroundColor: "white",
            width: "80%",
            height: "400px",
            marginTop: "20px",
            boxShadow: "0px 0px 10px rgba(100, 111, 203, 0.3)",
            overflowY: "auto",
          }}
        >
          {products.map((item, idx) => {
            return (
              <div
                key={idx}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <ProductCard
                  mainImage={item.images.mainImage}
                  name={item.name}
                  shortDescription={item.shortDescription}
                  quantity={item.inventory.quantity}
                  productId={item.productId}
                  deleteProduct={deleteProductAdmin}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface UserInfoCardProps {
  userInfo: UserInfo;
  blockUserAdmin: (value: string) => void;
  unblockUserAdmin: (value: string) => void;
}

export const UserInfoCard = (props: UserInfoCardProps) => {
  const [hover, setHover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "220px",
        width: "80%",
        margin: "15px",
        boxShadow: hover
          ? "0px 0px 12px rgba(100, 111, 203, 0.3)"
          : "0px 0px 5px rgba(100, 111, 203, 0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          margin: "0 20px 0 20px",
        }}
      >
        <div
          style={{
            height: "80%",
            width: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UserInfoCardTags tag="Nume" text={props.userInfo.firstName} />
          <UserInfoCardTags tag="Prenume" text={props.userInfo.lastName} />
          <UserInfoCardTags tag="Username" text={props.userInfo.userName} />
          <UserInfoCardTags tag="Email" text={props.userInfo.email} />
          <UserInfoCardTags tag="Telefon" text={props.userInfo.phoneNumber} />
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <AutenticationButtons
            onClick={() => props.blockUserAdmin(props.userInfo.userId)}
            buttonText={"Blochează utilizator"}
            className="deleteButton"
            style={{
              margin: "20px 0px 20px 0",
              width: "30%",
              height: "20%",
              backgroundColor: "#ff1a1a",
              color: "white",
            }}
          />
          <AutenticationButtons
            onClick={() => props.unblockUserAdmin(props.userInfo.userId)}
            buttonText={"Deblochează utilizator"}
            className="unblockButton"
            style={{
              margin: "20px 0px 20px 0",
              width: "35%",
              height: "20%",
              backgroundColor: "#00cc0e",
              color: "white",
            }}
          />
        </div>
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
    </div>
  );
};

interface UserInfoCardTagsProps {
  tag: string;
  text: string;
  typographyStyle?: CSSProperties;
  spanStyle?: CSSProperties;
}

export const UserInfoCardTags = (props: UserInfoCardTagsProps) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "start",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "30px",
      }}
    >
      <Typography
        style={{
          fontSize: "16px",
          marginRight: "10px",
          fontFamily: "sans-serif",
          ...props.typographyStyle,
        }}
      >
        {props.tag}:
      </Typography>
      <span
        style={{
          fontStyle: "italic",
          fontSize: "16px",
          color: "gray",
          ...props.spanStyle,
        }}
      >
        {props.text}
      </span>
    </div>
  );
};

interface ProductCardProps {
  mainImage: string;
  name: string;
  shortDescription: string;
  productId: string;
  quantity: number;
  deleteProduct: (value: string) => void;
}

export const ProductCard = (props: ProductCardProps) => {
  const [hover, setHover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: "220px",
        width: "80%",
        margin: "15px",
        boxShadow: hover
          ? "0px 0px 12px rgba(100, 111, 203, 0.3)"
          : "0px 0px 5px rgba(100, 111, 203, 0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          margin: "0 20px",
        }}
      >
        <div
          style={{
            height: "80%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={props.mainImage}
            alt={props.name}
            style={{
              width: "80px",
              height: "80px",
            }}
          />
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <UserInfoCardTags
              tag="Id"
              text={props.productId}
              typographyStyle={{ fontSize: "14px" }}
              spanStyle={{ fontSize: "13px" }}
            />
            <UserInfoCardTags
              tag="Cantitate"
              typographyStyle={{ fontSize: "14px" }}
              text={props.quantity.toString()}
              spanStyle={{ fontSize: "13px" }}
            />
            <UserInfoCardTags
              tag="Descriere"
              typographyStyle={{ fontSize: "14px" }}
              text={props.shortDescription}
              spanStyle={{ fontSize: "13px" }}
            />
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <AutenticationButtons
            onClick={() => props.deleteProduct(props.productId)}
            buttonText={"Șterge produs"}
            className="deleteButton"
            style={{
              margin: "20px 0px 20px 0",
              width: "30%",
              height: "20%",
              backgroundColor: "#ff1a1a",
              color: "white",
            }}
          />
        </div>
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
    </div>
  );
};
