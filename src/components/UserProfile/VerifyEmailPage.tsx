import { LogoImage } from "../Navbar/NavbarElements";
import logo from "../../images/logo.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { confirmEmail } from "../../API/user";
import { Typography } from "@mui/material";

export const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const createCall = async () => {
      const token = location.pathname.replace(
        "/api/authentication/confirm-email/",
        ""
      );

      if (token) {
        try {
          await confirmEmail(token);
          setSuccess(true);
        } catch (err: any) {
          setError(err.response.data.errors[0].description);
        }
      }
    };

    createCall();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#F7F7F7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "50%",
          height: "500px",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "8px",
          boxShadow: "0px 0px 10px rgba(100, 111, 203, 0.3)",
        }}
      >
        <div style={{ marginTop: "40px" }} onClick={() => navigate("/")}>
          <LogoImage
            src={logo}
            alt="Logo"
            style={{ width: "120px", marginBottom: "20px", cursor: "pointer" }}
          />
        </div>
        {success && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">
              Emailul a fost confirmat cu succes!
            </Typography>
            <span
              onClick={() => navigate("/")}
              style={{
                fontStyle: "italic",
                fontSize: "16px",
                textAlign: "center",
                marginTop: "40px",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Înapoi la pagina principală
            </span>
          </div>
        )}
        {error && (
          <span
            onClick={() => navigate("/")}
            style={{
              fontSize: "18px",
              textAlign: "center",
              marginTop: "40px",
              color: "red",
            }}
          >
            Se pare ca nu am putut confirma emailul, încearcă din nou.
          </span>
        )}
      </div>
    </div>
  );
};
