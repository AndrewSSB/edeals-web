import { Toolbar, Typography } from "@mui/material";
import logo from "../../images/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ClearIcon from "@mui/icons-material/Clear";
import {
  ButtonGap,
  LogoImage,
  NavbarContainer,
  NoHoverIconButton,
  RightIconsContainer,
  SearchContainer,
  SearchInput,
} from "./NavbarElements";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { DropdownContent } from "./DropdownContent";
import { useNavigate } from "react-router-dom";
import { AutenticationButtons } from "../CustomButtons/CustomButtons";
import { UserContext } from "../../context/UserContext";
import {
  getFavorites,
  getProducts,
  getShoppingSession,
} from "../../API/products";
import { ProductContext } from "../../context/ProductsContext";
import { LittleProductPage } from "../Products/LitttleProdcutPage";
import Payment from "../Payments/Payment";
import { getUser } from "../../API/user";
import { GetProductsFromLocalStorage } from "../../hooks/SetItemsToLocalStorage";
import { logoutUser } from "../../API/auth";

interface NavBarProps {
  isInBasketPage?: Boolean;
  isInFavoritePage?: Boolean;
}

export const Navbar = (props: NavBarProps) => {
  const {
    products,
    setProducts,
    setPageSize,
    setTotalPageNumber,
    setCurrentPageNumber,
    favorites,
    setFavorites,
    shoppingSession,
    setShoppingSession,
  } = useContext(ProductContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavoriteHovered, setIsFavoriteHovered] = useState(false);
  const [isBasketHovered, setIsBasketHovered] = useState(false);
  const {
    userData,
    setUserData,
    setFirstName,
    setLastName,
    isAuthenticated,
    setIsAuthenticated,
  } = useContext(UserContext);
  const [search, setSearch] = useState("");

  const hasFavorite = favorites.length > 0;
  const navigate = useNavigate();

  const searchChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(search);
    }
  };

  // Favorites And Cart Items and UserDetails
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("accessToken") ? true : false;
    setIsAuthenticated(isAuthenticated);

    const fetchFavorites = async () => {
      const favoritesFromLocalStorage = GetProductsFromLocalStorage({
        keyName: "favorite",
      });

      const productsFromLocal = products.filter((product) => {
        if (favoritesFromLocalStorage) {
          return favoritesFromLocalStorage.find(
            (prd) => prd.productId === product.productId
          );
        }
        return false;
      });

      if (isAuthenticated) {
        try {
          const response = await getFavorites();

          const responseData = response.data.responseData;

          setFavorites(responseData);
        } catch (error: any) {
          console.error("Failed to fetch favorite products:", error);
        }
      } else {
        setFavorites(productsFromLocal);
      }
    };

    const fetchCartItems = async () => {
      const cartItemsFromLocalStorage = GetProductsFromLocalStorage({
        keyName: "cartItems",
      });

      const productsFromLocal = products.filter((product) => {
        if (cartItemsFromLocalStorage) {
          return cartItemsFromLocalStorage.find(
            (prd) => prd.productId === product.productId
          );
        }
        return false;
      });

      if (isAuthenticated) {
        try {
          const response = await getShoppingSession(1);

          const responseData = response.data.responseData;
          setShoppingSession(responseData);
        } catch (error: any) {
          console.error("Failed to fetch shopping session:", error);
        }
      } else {
        shoppingSession.cartItems = productsFromLocal.map((prod, idx) => {
          return {
            cartItemId: idx,
            productId: prod.productId,
            productName: prod.name,
            quantity:
              cartItemsFromLocalStorage?.find(
                (x) => x.productId == prod.productId
              )?.quantity ?? 0,
            shoppingSessionId: 0,
            image: prod.images.mainImage,
            productPrice: prod.price.toString(),
            description: prod.shortDescription,
          };
        });

        shoppingSession.total = +shoppingSession.cartItems
          .reduce((accumulator, item) => {
            return accumulator + +item.productPrice * item.quantity;
          }, 0)
          .toFixed(2);

        setShoppingSession(shoppingSession);
      }
    };

    const fetchUserDetails = async () => {
      if (isAuthenticated) {
        try {
          const response = await getUser();

          const userDetails = response.data.responseData;

          setUserData({
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            userName: userDetails.userName,
            email: userDetails.email,
            isEmailVerified: userDetails.isEmailVerified,
            phoneNumber: userDetails.phoneNumber,
            isPhoneNumberVerified: userDetails.isPhoneNumberVerified,
            profileImage: "",
            addresses: userDetails.addresses,
          });

          setFirstName(userDetails.firstName);
          setLastName(userDetails.lastName);
        } catch (error: any) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          console.error("Failed to fetch user details:", error);
        }
      }
    };

    fetchFavorites();
    fetchCartItems();
    fetchUserDetails();
  }, []);

  const clearSearch = () => {
    setSearch("");
    handleSearch(null);
  };

  const handleSearch = async (value: string | null) => {
    const response = await getProducts({
      start: null,
      limit: null,
      productName: value,
    });

    const responseData = response.data.responseData;
    setProducts(responseData.data);
    setPageSize(responseData.pageSize);
    setTotalPageNumber(responseData.totalPageNumber);
    setCurrentPageNumber(responseData.currentPageNumber);
  };

  const goToWelcome = () => {
    navigate("/");
  };

  const SignOut = async () => {
    try {
      await logoutUser();

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/";
    } catch (ex) {
      console.error(ex);
    }
  };

  return (
    <NavbarContainer position="sticky" color="default">
      <Toolbar>
        <NoHoverIconButton
          size="large"
          edge="start"
          aria-label="logo"
          disableRipple
          onClick={goToWelcome}
        >
          <LogoImage src={logo} alt="Logo" />
        </NoHoverIconButton>

        <SearchContainer>
          <SearchInput
            placeholder="Caută produsele dorite..."
            color="primary"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={searchChange}
            sx={{
              paddingLeft: "5px",
            }}
          />
          <NoHoverIconButton
            size="large"
            edge="start"
            aria-label="logo"
            disableRipple
            onClick={clearSearch}
          >
            {search && <ClearIcon />}
          </NoHoverIconButton>
          <NoHoverIconButton
            size="large"
            edge="start"
            aria-label="logo"
            disableRipple
            onClick={() => handleSearch(search)}
          >
            <SearchIcon />
          </NoHoverIconButton>
        </SearchContainer>
        <RightIconsContainer>
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ position: "relative" }}
          >
            <NoHoverIconButton
              size="large"
              edge="start"
              aria-label="account"
              disableRipple
            >
              <AccountCircleIcon fontSize="large" sx={{ color: "#646FCB" }} />
              <Typography
                variant="body1"
                sx={{ marginLeft: "8px", color: "black" }}
              >
                Contul meu
              </Typography>
              <ArrowDropDownIcon sx={{ color: "black" }} />
            </NoHoverIconButton>

            {isHovered && !isAuthenticated && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  left: "auto",
                  width: "300px",
                  backgroundColor: "#F7F7F7",
                  padding: "10px",
                  boxShadow: "0px 2px 4px rgba(100, 111, 203, 0.6)",
                  zIndex: 1,
                }}
              >
                <DropdownContent />
              </div>
            )}

            {isHovered && isAuthenticated && userData.userName && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  width: "200px",
                  backgroundColor: "#F7F7F7",
                  padding: "20px",
                  boxShadow: "0px 2px 4px rgba(100, 111, 203, 0.6)",
                  zIndex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "15px",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  Bun venit, {userData.userName}
                </Typography>
                <AutenticationButtons
                  buttonText="Vezi profilul"
                  buttonWidth="100%"
                  onClick={() => navigate("/profile")}
                />
                <AutenticationButtons
                  style={{ marginTop: "20px" }}
                  buttonText="Logout"
                  buttonWidth="100%"
                  onClick={SignOut}
                />
              </div>
            )}
          </div>
          <ButtonGap />
          <div
            onMouseEnter={() => setIsFavoriteHovered(true)}
            onMouseLeave={() => setIsFavoriteHovered(false)}
            style={{ position: "relative" }}
          >
            <NoHoverIconButton
              size="large"
              edge="start"
              aria-label="account"
              disableRipple
            >
              <FavoriteBorderIcon
                fontSize="large"
                sx={{
                  color: "#646FCB",
                  index: 1,
                }}
              />
              {hasFavorite && (
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    position: "absolute",
                    backgroundColor: "red",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "white",
                    left: "30px",
                    top: "12px",
                  }}
                >
                  {favorites.length > 10 ? 9 + "+" : favorites.length}
                </div>
              )}
              <Typography
                variant="body1"
                sx={{ marginLeft: "8px", color: "black" }}
              >
                Favorite
              </Typography>
              <ArrowDropDownIcon sx={{ color: "black" }} />
            </NoHoverIconButton>
            {isFavoriteHovered && hasFavorite && !props.isInFavoritePage && (
              <div
                style={{
                  backgroundColor: "#F7F7F7",
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  left: "auto",
                  width: "400px",
                  padding: "20px",
                  height: "auto",
                  boxShadow: "0px 2px 4px rgba(100, 111, 203, 0.6)",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#2f366f", marginBottom: "10px" }}>
                    Ultimele produse adăugate
                  </span>
                  <LittleProductPage
                    showQuantity={false}
                    favorites={favorites}
                  />
                  <div style={{ margin: "8px 0" }}></div>
                  <AutenticationButtons
                    buttonText="Vezi produsele favorite"
                    buttonWidth="80%"
                    onClick={() => navigate("/favorite")}
                  />
                </div>
              </div>
            )}
          </div>
          <ButtonGap />
          <div
            onMouseEnter={() => setIsBasketHovered(true)}
            onMouseLeave={() => setIsBasketHovered(false)}
            style={{ position: "relative" }}
          >
            <NoHoverIconButton
              size="large"
              edge="start"
              aria-label="account"
              disableRipple
            >
              <ShoppingCartIcon fontSize="large" sx={{ color: "#646FCB" }} />
              {shoppingSession && shoppingSession.cartItems.length > 0 && (
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    position: "absolute",
                    backgroundColor: "red",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "white",
                    left: "30px",
                    top: "12px",
                  }}
                >
                  {shoppingSession.cartItems.length > 10
                    ? 9 + "+"
                    : shoppingSession.cartItems.length}
                </div>
              )}
              <Typography
                variant="body1"
                sx={{ marginLeft: "8px", color: "black" }}
              >
                Coșul meu
              </Typography>
              <ArrowDropDownIcon sx={{ color: "black" }} />
            </NoHoverIconButton>
            {isBasketHovered &&
              shoppingSession.cartItems.length > 0 &&
              !props.isInBasketPage && (
                <div
                  style={{
                    backgroundColor: "#F7F7F7",
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    left: "auto",
                    width: "400px",
                    padding: "20px",
                    height: "auto",
                    boxShadow: "0px 2px 4px rgba(100, 111, 203, 0.6)",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#2f366f", marginBottom: "10px" }}>
                      Ultimele produse adăugate
                    </span>
                    <LittleProductPage
                      showQuantity={true}
                      shoppingSession={shoppingSession}
                    />
                    <div
                      style={{
                        alignItems: "flex-start",
                        fontFamily: "sans-serif",
                        fontSize: "15px",
                        margin: "10px 0 0 0",
                      }}
                    >
                      TOTAL: {+shoppingSession.total.toFixed(2)} lei
                    </div>
                    <div style={{ margin: "8px 0" }}></div>
                    <AutenticationButtons
                      buttonText="Vezi produsele din coș"
                      buttonWidth="100%"
                      onClick={() => navigate("/basket")}
                    />
                  </div>
                </div>
              )}
          </div>
        </RightIconsContainer>
      </Toolbar>
    </NavbarContainer>
  );
};
