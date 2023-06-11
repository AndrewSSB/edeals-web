import { Typography } from "@mui/material";

export const CategoriesDropdown = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Typography
        sx={{
          fontSize: "15px",
          marginLeft: "15px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        Laptopuri, Tablete și Telefoane
      </Typography>
      <Typography
        sx={{
          fontSize: "15px",
          marginLeft: "15px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        PC și Periferice
      </Typography>
      <Typography
        sx={{
          fontSize: "15px",
          cursor: "pointer",
          marginLeft: "15px",
        }}
      >
        Gaming
      </Typography>
    </div>
  );
};
