import { Toolbar, Typography } from "@mui/material";
import logo from "../../images/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ClearIcon from "@mui/icons-material/Clear";

import {
  ButtonGap,
  LogoImage,
  NavbarContainer,
  NoHoverIconButton,
  RightIconsContainer,
  SearchContainer,
  SearchInput,
} from "./NavbarElements";
import { useContext, useState } from "react";
import { DropdownContent } from "./DropdownContent";
import { useNavigate } from "react-router-dom";
import { AutenticationButtons } from "../CustomButtons/CustomButtons";
import { UserContext } from "../../context/UserContext";

interface NavBarProps {
  isAuthenticated: Boolean;
}

export const Navbar = (props: NavBarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { userData } = useContext(UserContext);

  const navigate = useNavigate();

  return (
    <NavbarContainer position="sticky" color="default">
      <Toolbar>
        <NoHoverIconButton
          size="large"
          edge="start"
          aria-label="logo"
          disableRipple
        >
          <LogoImage src={logo} alt="Logo" />
        </NoHoverIconButton>

        <SearchContainer>
          <SearchInput
            placeholder="Caută produsele dorite..."
            color="primary"
            sx={{
              paddingLeft: "5px",
            }}
          />
          <NoHoverIconButton
            size="large"
            edge="start"
            aria-label="logo"
            disableRipple
          >
            <SearchIcon />
          </NoHoverIconButton>
        </SearchContainer>
        <RightIconsContainer>
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ position: "relative" }}
          >
            <NoHoverIconButton
              size="large"
              edge="start"
              aria-label="account"
              disableRipple
            >
              <AccountCircleIcon fontSize="large" sx={{ color: "#646FCB" }} />
              <Typography
                variant="body1"
                sx={{ marginLeft: "8px", color: "black" }}
              >
                Contul meu
              </Typography>
              <ArrowDropDownIcon sx={{ color: "black" }} />
            </NoHoverIconButton>

            {isHovered && !props.isAuthenticated && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  left: "auto",
                  width: "300px",
                  backgroundColor: "white",
                  padding: "20px",
                  boxShadow: "0px 2px 4px rgba(100, 111, 203, 0.6)",
                  zIndex: 1,
                }}
              >
                <DropdownContent />
              </div>
            )}

            {isHovered && props.isAuthenticated && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  left: "auto",
                  width: "200px",
                  backgroundColor: "white",
                  padding: "20px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
                  zIndex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "15px",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  Bun venit, {userData.userName}
                </Typography>
                <AutenticationButtons
                  buttonText="Vezi profilul"
                  buttonWidth="100%"
                  onClick={() => navigate("/profil")}
                />
              </div>
            )}
          </div>
          <ButtonGap />

          <NoHoverIconButton
            size="large"
            edge="start"
            aria-label="account"
            disableRipple
          >
            <FavoriteBorderIcon
              fontSize="large"
              sx={{
                color: "#646FCB",
              }}
            />
            <Typography
              variant="body1"
              sx={{ marginLeft: "8px", color: "black" }}
            >
              Favorite
            </Typography>
            <ArrowDropDownIcon sx={{ color: "black" }} />
          </NoHoverIconButton>

          <ButtonGap />

          <NoHoverIconButton
            size="large"
            edge="start"
            aria-label="account"
            disableRipple
          >
            <ShoppingCartIcon fontSize="large" sx={{ color: "#646FCB" }} />
            <Typography
              variant="body1"
              sx={{ marginLeft: "8px", color: "black" }}
            >
              Coșul meu
            </Typography>
            <ArrowDropDownIcon sx={{ color: "black" }} />
          </NoHoverIconButton>
        </RightIconsContainer>
      </Toolbar>
    </NavbarContainer>
  );
};
