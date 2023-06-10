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

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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
          <Typography component="h1" variant="h5" sx={{ marginTop: "20px" }}>
            Sign in
          </Typography>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column" }}>
            <TextField
              margin="normal"
              required
              id="email"
              label="Email Address or Username"
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
              label="Password"
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
                <Link href="#" variant="body2" sx={{ color: "#646FCB" }}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" sx={{ color: "#646FCB" }}>
                  {"Don't have an account? Sign Up"}
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
