import { useContext, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { SubNavBar } from "../Navbar/SubNavbar";
import { Box } from "@mui/material";
import { ProductPage } from "../Products/ProductPage";
import { Product, ProductContext } from "../../context/ProductsContext";
import { createOrder } from "../../API/products";

interface WelcomePageProps {}

export const WelcomePage = () => {
  const [categoryId, setCategoryId] = useState<number>();
  const { products } = useContext(ProductContext);
  const [copyProducts, setCopyProducts] = useState<Product[]>([]);

  const searchByCategory = (categoryId: number) => {
    console.log(categoryId);
    setCategoryId(categoryId);
    // setCopyProducts(products.filter(product => product.categories.));
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
