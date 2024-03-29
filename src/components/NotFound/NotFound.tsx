import { LogoImage } from "../Navbar/NavbarElements";
import logo from "../../images/logo.png";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

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
          justifyContent: "center",
          borderRadius: "8px",
          boxShadow: "0px 0px 10px rgba(100, 111, 203, 0.3)",
        }}
      >
        <div onClick={() => navigate("/")}>
          <LogoImage
            src={logo}
            alt="Logo"
            style={{ width: "120px", marginBottom: "20px", cursor: "pointer" }}
          />
        </div>
        <h1
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}
        >
          OOPS!
        </h1>
        <p style={{ fontSize: "16px", marginBottom: "30px" }}>
          Page not found.
        </p>
      </div>
    </div>
  );
};
