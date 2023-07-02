import { useContext, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { SubNavBar } from "../Navbar/SubNavbar";
import { Box } from "@mui/material";
import { ProductPage } from "../Products/ProductPage";
import { Product, ProductContext } from "../../context/ProductsContext";
import { createOrder, getProducts } from "../../API/products";

interface WelcomePageProps {}

export const WelcomePage = () => {
  const [categoryId, setCategoryId] = useState<number>();
  const { products, setProducts } = useContext(ProductContext);
  const [categoryName, setCategoryName] = useState("");

  const searchByCategory = async (categoryId: number) => {
    const response = await getProducts({
      start: null,
      limit: null,
      productName: null,
      categoryId: categoryId,
    });

    const responseData = response.data.responseData;
    // setProducts(responseData.data);
    console.log(responseData);
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
      <SubNavBar onClick={searchByCategory} />

      <ProductPage products={products} />
    </Box>
  );
};
