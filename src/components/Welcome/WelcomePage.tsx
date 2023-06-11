import { useContext } from "react";
import { Navbar } from "../Navbar/Navbar";
import { SubNavBar } from "../Navbar/SubNavbar";
import { Box } from "@mui/material";
import { ProductPage } from "../Products/ProductPage";

export const WelcomePage = () => {
  const isAuthenticated = localStorage.getItem("accessToken") ? true : false;

  return (
    <Box
      sx={{
        backgroundColor: "#f2f2f7",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar isAuthenticated={isAuthenticated} />
      <SubNavBar />

      <ProductPage />
    </Box>
  );
};
