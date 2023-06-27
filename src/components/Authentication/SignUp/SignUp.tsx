import {
  Alert,
  AlertTitle,
  Box,
  Container,
  CssBaseline,
  Grid,
  Link,
  Slide,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import SignIn, { Copyright } from "../SignIn/SignIn";
import { LogoImage } from "../../Navbar/NavbarElements";
import logo from "../../../images/logo.png";
import { AutenticationButtons } from "../../CustomButtons/CustomButtons";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { registerUser } from "../../../API/auth";
const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default function SignUp() {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    userName,
    setUserName,
    phoneNumber,
    setPhoneNumber,
    token,
    setToken,
    setIsAuthenticated,
  } = useContext(UserContext);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const changeFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const changeLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const changeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const changePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const changeConfPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleRegister = async () => {
    try {
      if (!firstName) {
        throw new Error("First Name cannot be empty");
      }
      if (!lastName) {
        throw new Error("Last Name cannot be empty");
      }
      if (!userName) {
        throw new Error("Username cannot be empty");
      }
      if (!email) {
        throw new Error("Email cannot be empty");
      }
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }
      if (!phoneNumber) {
        throw new Error("Phone Number cannot be empty");
      }
      if (!password) {
        throw new Error("Password cannot be empty");
      }

      if (password != confirmPassword) {
        throw new Error("Password does not match");
      }

      const response = await registerUser(
        firstName!,
        lastName!,
        userName!,
        email!,
        phoneNumber!,
        password
      );

      setToken(response.data.responseData.accessToken);
      setIsAuthenticated(true);

      localStorage.setItem(
        "accessToken",
        response.data.responseData.accessToken
      );
      localStorage.setItem(
        "refreshToken",
        response.data.responseData.refreshToken
      );
      navigate("/");
    } catch (error: any) {
      const firstErrorMessage = error.response?.data?.errors[0]?.description;
      if (firstErrorMessage) {
        setError(firstErrorMessage);
      } else {
        setError(error.message);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  const toSignIn = () => {
    navigate("/signin");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#F7F7F7",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          height: "700px",
          minWidth: "500px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 0px 10px rgba(100, 111, 203, 0.3)",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ margin: "-50px 0 0px 0" }}>
            <LogoImage
              src={logo}
              alt="Logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
          </div>
          <Typography
            component="h6"
            variant="h6"
            sx={{ marginTop: "20px", fontSize: "15px" }}
          >
            Crează-ți propriul cont e-Deals
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Nume"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={changeLastName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Prenume"
                  autoFocus
                  onChange={changeFirstName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Adresă de email"
                  name="email"
                  autoComplete="email"
                  onChange={changeEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="username"
                  label="Nume de utilizator"
                  type="username"
                  id="username"
                  autoComplete="username"
                  onChange={changeUserName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phoneNumber"
                  label="Număr de telefon"
                  type="phoneNumber"
                  id="phoneNumber"
                  autoComplete="phoneNumber"
                  onChange={changePhoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Parola"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={changePassword}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirma Parola"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  onChange={changeConfPassword}
                />
              </Grid>
            </Grid>
            <div
              style={{
                margin: "30px 0 20px 0",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <AutenticationButtons
                buttonText="Înregistrează-te"
                buttonWidth="80%"
                type="submit"
                onClick={handleRegister}
              />
            </div>
            <Grid container justifyContent="center">
              <Grid item>
                <Link
                  variant="body2"
                  onClick={toSignIn}
                  sx={{ color: "#646FCB", cursor: "pointer" }}
                >
                  Ai deja un cont? Conectează-te
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
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
      </Container>
    </div>
  );
}
