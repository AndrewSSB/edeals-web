import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { AddressForm } from "./AddressForm";
import { Copyright } from "../Authentication/SignIn/SignIn";
import { Review } from "./Review";
import logo from "../../images/logo.png";
import { LogoImage } from "../Navbar/NavbarElements";
import { AutenticationButtons } from "../CustomButtons/CustomButtons";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ProductContext, ShoppingSession } from "../../context/ProductsContext";
import { Address, User, UserContext } from "../../context/UserContext";

const steps = ["Shipping address", "Review your order"];

export interface CheckoutProps {
  address: Address;
}

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0);
  const { shoppingSession } = useContext(ProductContext);
  const { userData, firstName, setFirstName, lastName, setLastName } =
    useContext(UserContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState<Address>({});

  const getStepContent = (step: number, shopping: ShoppingSession) => {
    switch (step) {
      case 0:
        return (
          <AddressForm
            address={address}
            setAddress={setAddress}
            setFirstName={setFirstName}
            setLastName={setLastName}
            firstName={firstName}
            lastName={lastName}
          />
        );
      case 1:
        return (
          <Review
            shoppingSession={shopping}
            address={address}
            firstName={firstName}
            lastName={lastName}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);

    if (activeStep === steps.length - 1) {
      handleProductDetails();
    }
  };

  const handleBack = () => {
    if (activeStep <= 0) {
      navigate("/basket");
    }
    setActiveStep(activeStep - 1);
  };

  const handleProductDetails = () => {
    navigate(`/payment/${shoppingSession.cartItems[0].shoppingSessionId}`);
  };

  return (
    <div style={{ backgroundColor: "#F7F7F7", minHeight: "100vh" }}>
      <Container component="main" maxWidth="sm">
        <AppBar
          position="absolute"
          color="default"
          elevation={0}
          sx={{
            position: "relative",
          }}
        ></AppBar>
        <Paper
          sx={{
            boxShadow: "0px 0px 10px rgba(100, 111, 203, 0.3)",
            padding: "20px",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <LogoImage
              src={logo}
              alt="Logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div style={{ marginTop: "40px" }}>
            {activeStep === steps.length ? (
              <div></div>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep, shoppingSession)}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <AutenticationButtons
                      buttonText={"Întoarce-te"}
                      buttonWidth="160px"
                      type="submit"
                      style={{
                        margin: "20px 0px 20px 20px",
                        fontSize: "16px",
                      }}
                      onClick={handleBack}
                    />
                  </Box>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <AutenticationButtons
                      buttonText={
                        activeStep === steps.length - 1
                          ? "Plasează comanda"
                          : "Continuă"
                      }
                      buttonWidth="160px"
                      type="submit"
                      style={{
                        margin: "20px 20px 20px 0px",
                        fontSize: "16px",
                      }}
                      onClick={handleNext}
                    />
                  </Box>
                </div>
              </React.Fragment>
            )}
          </div>
        </Paper>
        <Copyright style={{ margin: "20px 0px 10px 0px" }} />
      </Container>
    </div>
  );
}
