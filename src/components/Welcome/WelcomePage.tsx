import { CSSProperties, useContext, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { SubNavBar } from "../Navbar/SubNavbar";
import { Box } from "@mui/material";
import { ProductPage } from "../Products/ProductPage";
import { Product, ProductContext } from "../../context/ProductsContext";
import { createOrder, getProducts } from "../../API/products";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface WelcomePageProps {}

export const WelcomePage = () => {
  const [categoryId, setCategoryId] = useState<number>();
  const { products, setProducts } = useContext(ProductContext);
  const [clickCount, setClickCount] = useState(0);

  const searchByCategory = async (categoryId: number) => {
    await handleSearch(categoryId, null);
  };

  const removeCategory = async () => {
    setCategoryId(undefined);
    await handleSearch(null, null);
  };

  const handleSearch = async (
    categoryId: number | null | undefined,
    orderByPrice: boolean | null | undefined
  ) => {
    try {
      const response = await getProducts({
        start: null,
        limit: null,
        productName: null,
        categoryId: categoryId === undefined ? null : categoryId,
        orderByPrice: orderByPrice === undefined ? null : orderByPrice,
      });

      const responseData = response.data.responseData;

      setProducts(responseData.data);
      if (categoryId) {
        setCategoryId(categoryId);
      }
    } catch (ex: any) {}
  };

  const handleClick = () => {
    setClickCount((prevCount) => (prevCount + 1) % 3);

    const orderByPrice =
      clickCount + 1 === 1 ? true : clickCount + 1 === 2 ? false : null;

    handleSearch(categoryId, orderByPrice);
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
      <Navbar isInBasketPage={false} isInFavoritePage={false} />
      <SubNavBar
        onClick={searchByCategory}
        categoryId={categoryId}
        removeCategory={removeCategory}
      />

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

      <ProductPage products={products} />
    </Box>
  );
};
