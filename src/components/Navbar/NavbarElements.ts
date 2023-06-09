import { AppBar, IconButton, InputBase, alpha } from "@mui/material";
import { styled } from "@mui/system";

export interface NavProps {}

export const LogoImage = styled("img")`
  width: 100px;
  height: auto;
  object-fit: contain;
`;

export const NoHoverIconButton = styled(IconButton)`
  &&:hover {
    background-color: transparent;
  }
`;

export const SearchContainer = styled("div")`
  display: flex;
  align-items: center;
  background-color: ${alpha("#ffffff", 0.15)};
  border-radius: 4px;
  padding: 0 8px;
  margin-right: 16px;
  border: 1px solid #646fcb; /* Add border style */
  border-radius: 20px;
  flex-grow: 1;
  max-width: 800px;
  margin: 0px 20px 0px 20px;
  height: 40px;
`;

export const SearchInput = styled(InputBase)`
  color: black;
  flex: 1;
`;

export const NavbarContainer = styled(AppBar)`
  margin: 0,
  display: flex;
  justify-content: space-between;
`;

export const RightIconsContainer = styled("div")`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

export const ButtonGap = styled("div")`
  margin-left: 20px;
`;

export const PopoverContent = styled("div")`
  padding: 8px;
`;
