import { CSSProperties, useContext, useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { SubNavBar } from "../Navbar/SubNavbar";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ProductPage } from "../Products/ProductPage";
import { Product, ProductContext } from "../../context/ProductsContext";
import { createOrder, getProducts } from "../../API/products";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface WelcomePageProps {}

export const WelcomePage = () => {
  const [categoryId, setCategoryId] = useState<number>();
  const [copyProducts, setCopyProducts] = useState<Product[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [orderByPriceBool, setOrderByPriceBool] = useState<boolean | null>(
    null
  );
  const [productName, setProdctName] = useState<string | null>(null);

  useEffect(() => {
    handleSearch(null, null, null);
  }, []);

  const handleNavbarSearch = async (value: string | null) => {
    await handleSearch(value, categoryId, orderByPriceBool);
    setProdctName(value);
  };

  const searchByCategory = async (categoryId: number) => {
    await handleSearch(productName, categoryId, orderByPriceBool);
    setCategoryId(categoryId);
  };

  const removeCategory = async () => {
    setCategoryId(undefined);
    await handleSearch(productName, null, orderByPriceBool);
  };

  const handleSearch = async (
    productName: string | null | undefined,
    categoryId: number | null | undefined,
    orderByPrice: boolean | null | undefined
  ) => {
    try {
      const response = await getProducts({
        start: null,
        limit: null,
        productName: productName === undefined ? null : productName,
        categoryId: categoryId === undefined ? null : categoryId,
        orderByPrice: orderByPrice === undefined ? null : orderByPrice,
      });

      const responseData = response.data.responseData;

      setCopyProducts(responseData.data);
    } catch (ex: any) {
      console.error(ex);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleClick = () => {
    setClickCount((prevCount) => (prevCount + 1) % 3);

    const orderByPrice =
      clickCount + 1 === 1 ? true : clickCount + 1 === 2 ? false : null;

    handleSearch(productName, categoryId, orderByPrice);
  };

  const getArrowIcon = (text: string) => {
    const commonStyles: CSSProperties = {
      fontStyle: "italic",
      fontSize: "16px",
      textAlign: "center",
      cursor: "pointer",
      alignItems: "center",
    };

    const handleClickAndIcon = (icon: React.ReactNode) => (
      <div
        onClick={handleClick}
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          marginLeft: "10px",
          ...commonStyles,
        }}
      >
        <span>{text}</span>
        {icon}
      </div>
    );

    switch (clickCount) {
      case 0:
        return null;
      case 1:
        return handleClickAndIcon(
          <KeyboardArrowUpIcon style={{ marginTop: "3px" }} />
        );
      case 2:
        return handleClickAndIcon(<KeyboardArrowDownIcon />);
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f2f2f7",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar
        isInBasketPage={false}
        isInFavoritePage={false}
        searchBar={handleNavbarSearch}
      />
      <SubNavBar
        onClick={searchByCategory}
        categoryId={categoryId}
        removeCategory={removeCategory}
      />

      {!isLoading && copyProducts.length > 0 && (
        <div
          style={{
            margin: "20px 0px 0px 20px",
            height: "30px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <span
            onClick={handleClick}
            style={{ cursor: "pointer", fontSize: "20px" }}
          >
            Ordonează
          </span>
          {getArrowIcon("dupa preț")}
        </div>
      )}

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "#646FCB" }} />
            <Typography
              variant="h6"
              style={{
                marginTop: "40px",
                padding: "10px 0 10px 0",
                color: "#646FCB",
                display: "flex",
                alignItems: "center",
              }}
            >
              Un moment, îți încărcăm produsele
            </Typography>
          </div>
        </div>
      ) : (
        <ProductPage products={copyProducts} />
      )}
    </Box>
  );
};
