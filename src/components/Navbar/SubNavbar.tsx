import { Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useContext, useState } from "react";
import { DropdownContent } from "./DropdownContent";
import { CategoriesDropdown } from "./CategoriesDropdown";
import { ProductContext } from "../../context/ProductsContext";

interface SubNavBarProps {
  onClick: (value: number) => void;
}

export const SubNavBar = (props: SubNavBarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { categories, setCategories } = useContext(ProductContext);

  return (
    <div
      style={{
        width: "100%",
        height: "45px",
        backgroundColor: "#646FCB",
        display: "flex",
        alignItems: "center",
        justifyContent: "left",
        position: "relative",
      }}
    >
      <Toolbar onMouseLeave={() => setIsHovered(false)}>
        <div
          onMouseEnter={() => setIsHovered(true)}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color: isHovered ? "black" : "white",
            padding: "5px 15px",
            borderRadius: "30px",
            backgroundColor: isHovered ? "white" : "inherit",
          }}
        >
          <MenuIcon />
          <span
            style={{
              fontSize: "18px",
              fontWeight: " 400",
              marginLeft: "5px",
            }}
          >
            Produse
          </span>
          {isHovered && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: "auto",
                left: "20px",
                width: "250px",
                backgroundColor: "white",
                padding: "20px",
                boxShadow: "0px 2px 4px rgba(100, 111, 203, 0.6)",
                zIndex: 1,
              }}
            >
              <CategoriesDropdown
                categories={categories}
                onClick={props.onClick}
              />
            </div>
          )}
        </div>
      </Toolbar>
    </div>
  );
};
