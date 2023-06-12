import { Box, Grid } from "@mui/material";
import { Navbar } from "../Navbar/Navbar";

export const Basket = () => {
  const isAuthenticated = localStorage.getItem("accessToken") ? true : false;
  return (
    <Box
      sx={{
        backgroundColor: "#f2f2f7",
        minHeight: "100vh",
      }}
    >
      <Navbar
        isAuthenticated={isAuthenticated}
        isInBasketPage={true}
        isInFavoritePage={false}
      />
    </Box>
  );
};
