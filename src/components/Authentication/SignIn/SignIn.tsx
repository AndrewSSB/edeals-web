import { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../API/auth";
import {
  Alert,
  AlertTitle,
  Box,
  Container,
  CssBaseline,
  Grid,
  Slide,
  Snackbar,
  TextField,
  Typography,
  createTheme,
} from "@mui/material";
import Link from "@mui/material/Link";
import { LogoImage } from "../../Navbar/NavbarElements";
import logo from "../../../images/logo.png";
import { AutenticationButtons } from "../../CustomButtons/CustomButtons";

export const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        e-Deals
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
  const { email, setEmail, userName, setUserName, token, setToken } =
    useContext(UserContext);
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value && emailRegex.test(value)) {
      setEmail(value);
    } else if (value) {
      setUserName(value);
    }
  };

  const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const submitLogin = async () => {
    try {
      const response = await loginUser(userName, email, password);

      setToken(response.data.responseData.accessToken);

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

  const toSignUp = () => {
    navigate("/signup");
  };

  const toForgotPassword = () => {
    navigate("/forgot-password");
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
          height: "600px",
          minWidth: "500px",
          backgroundColor: "#FFFFFF",
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
          <div style={{ margin: "-25px 0 20px 0" }}>
            <LogoImage src={logo} alt="Logo" />
          </div>
          <Typography
            component="h6"
            variant="h6"
            sx={{ marginTop: "20px", fontSize: "15px" }}
          >
            Contectează-te în contul tău e-Deals
          </Typography>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column" }}>
            <TextField
              margin="normal"
              required
              id="email"
              label="Adresa de email sau nume de utilizator"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={changeEmail}
              sx={{ width: "350px" }}
            />
            <TextField
              margin="normal"
              required
              name="password"
              label="Parola"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={changePassword}
              sx={{ width: "350px" }}
            />
            <div
              style={{
                margin: "60px 0 20px 0",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <AutenticationButtons
                buttonText="Intra în cont"
                buttonWidth="80%"
                type="submit"
                onClick={submitLogin}
              />
            </div>
            <Grid container>
              <Grid item xs>
                <Link
                  variant="body2"
                  onClick={toForgotPassword}
                  sx={{ color: "#646FCB", cursor: "pointer" }}
                >
                  Ai uitat parola?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  variant="body2"
                  onClick={toSignUp}
                  sx={{ color: "#646FCB", cursor: "pointer" }}
                >
                  Nu ai cont? Înregistrează-te aici
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
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
