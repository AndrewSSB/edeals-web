import { useContext } from "react";
import { Navbar } from "../Navbar/Navbar";
import { SubNavBar } from "../Navbar/SubNavbar";
import { Box } from "@mui/material";
import { ProductPage } from "../Products/ProductPage";

export const WelcomePage = () => {
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
      <SubNavBar />

      <ProductPage />
    </Box>
  );
};
