import { Typography } from "@mui/material";
import { AutenticationButtons } from "../CustomButtons/CustomButtons";
import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";

export const DropdownContent = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <AccountBoxTwoToneIcon fontSize="large" sx={{ color: "#646FCB" }} />
        <Typography sx={{ fontSize: "12px", marginLeft: "15px" }}>
          Intra în contul tău eDeals și bucură-te de o experiență de neuitat!
        </Typography>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          margin: "0 auto",
          marginTop: "20px",
          justifyContent: "space-between",
        }}
      >
        <AutenticationButtons buttonText="Intra în cont" buttonWidth="40%" />
        <AutenticationButtons buttonText="Înregistrează-te" buttonWidth="50%" />
      </div>
    </div>
  );
};
