import { useContext } from "react";
import { Navbar } from "../Navbar/Navbar";
import { UserContext } from "../../context/UserContext";

export const WelcomePage = () => {
  const isAuthenticated = localStorage.getItem("accessToken") ? true : false;

  return <Navbar isAuthenticated={isAuthenticated} />;
};
