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
import { useContext, useEffect, useState } from "react";
import {
  ProductContext,
  ShoppingSession,
  Transport,
} from "../../context/ProductsContext";
import { Address, User, UserContext } from "../../context/UserContext";
import { Alert, AlertTitle, Slide, Snackbar } from "@mui/material";
import { getAddress, saveUserAddress } from "../../API/user";

const steps = ["Shipping address", "Review your order"];

export interface CheckoutProps {
  address: Address;
}

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0);
  const { shoppingSession, transport, setTransport } =
    useContext(ProductContext);
  const {
    userData,
    setUserData,
    firstName,
    setFirstName,
    lastName,
    setLastName,
  } = useContext(UserContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState<Address>({});
  const [error, setError] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);

  const handleCloseSnackbar = () => {
    setError(null);
  };

  useEffect(() => {
    const getTransportDetails = async () => {
      // call the courier api
      setTransport({ transportPrice: 33.99 });
    };

    getTransportDetails();
  }, []);

  const getStepContent = (
    step: number,
    shopping: ShoppingSession,
    transport: Transport
  ) => {
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
            saveAddress={saveAddress}
            setSaveAddress={setSaveAddress}
          />
        );
      case 1:
        return (
          <Review
            shoppingSession={shopping}
            address={address}
            firstName={firstName}
            lastName={lastName}
            transport={transport}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  };

  const handleNext = async () => {
    if (!firstName) {
      setError("Prenumele trebuie completat");
      return;
    }

    if (!lastName) {
      setError("Prenumele trebuie completat");
      return;
    }

    if (!address.address) {
      setError("Adresa trebuie completata");
      return;
    }

    if (!address.city) {
      setError("Orasul trebuie completat");
      return;
    }

    if (!address.postalCode) {
      setError("Tara trebuie completata");
      return;
    }

    if (!address.region) {
      setError("Judetul trebuie completat");
      return;
    }

    if (saveAddress) {
      try {
        await saveUserAddress(address);
      } catch (e: any) {
        console.log(e.response.data);
      }
    }

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

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getAddress();
        const addresses = response.data.responseData;

        userData.addresses = addresses;
        setUserData(userData);

        setAddress(addresses[0]);
      } catch {
        console.error("n-a mers addresses");
      }
    };

    fetchAddresses();
  }, []);

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
                {getStepContent(activeStep, shoppingSession, transport)}
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
}
