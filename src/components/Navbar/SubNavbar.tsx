import { Card, CardContent, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useContext, useEffect, useState } from "react";
import VerifiedTwoToneIcon from "@mui/icons-material/VerifiedTwoTone";
import { CategoriesDropdown } from "./CategoriesDropdown";
import { ProductContext } from "../../context/ProductsContext";
import {
  NoHoverIconButton,
  SearchContainer,
  SearchInput,
} from "./NavbarElements";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { getUsers } from "../../API/user";
import { ChatBox } from "../Chat/Chatbox";
import { UserContext } from "../../context/UserContext";
import {
  sendJoinNotificationChannel,
  sendLeaveChannel,
  sendJoinChannel,
} from "../Chat/SignalR";
import { userInfo } from "os";

interface SubNavBarProps {
  onClick: (value: number) => void;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber: string;
  isPhoneNumberVerified: boolean;
}

export const SubNavBar = (props: SubNavBarProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const { categories, setCategories } = useContext(ProductContext);
  const [search, setSearch] = useState("");
  const [focus, setFocus] = useState(false);
  const [usersInfo, setUsersInfo] = useState<UserInfo[]>([]);

  const { channelId, setChannelId, connection, userData } =
    useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const clearSearch = () => {
    setSearch("");
    handleSearch(null);
    setFocus(false);
  };

  const searchChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(search);
    }
  };

  const handleSearch = async (value: string | null) => {
    try {
      const response = await getUsers(value);

      setUsersInfo(response.data.responseData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOnClick = (value: string) => {
    setFocus(false);
    handleSelectedUser(value);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers(null);

        setUsersInfo(response.data.responseData);
      } catch (e) {
        console.error(e);
      }
    };

    fetchUsers();
  }, []);

  const handleCloseChat = async () => {
    setSelectedUser(null);
    setChannelId("");
    try {
      await sendLeaveChannel(connection, channelId);
      await sendJoinNotificationChannel(connection);
    } catch {}
  };

  const handleSelectedUser = async (user: string) => {
    setSelectedUser(user);
    try {
      setChannelId(userData.userName + "__" + user);
      await sendJoinChannel(connection, userData.userName + "__" + user);
      await sendLeaveChannel(connection, "generic");
    } catch {
      console.error("Ceva nu a mers cum trebuie - hub");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "45px",
        backgroundColor: "#646FCB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
      {localStorage.getItem("accessToken") && (
        <div>
          <SearchContainer style={{ height: "30px", backgroundColor: "white" }}>
            <SearchInput
              placeholder="Caută un utilizator..."
              color="primary"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setFocus(true);
              }}
              onKeyDown={searchChange}
              sx={{
                paddingLeft: "5px",
              }}
              onClick={() => setFocus(true)}
              // onBlur={() => setFocus(false)}
            />
            <NoHoverIconButton
              size="large"
              edge="start"
              aria-label="logo"
              disableRipple
              onClick={clearSearch}
            >
              {search && <ClearIcon />}
            </NoHoverIconButton>
            <NoHoverIconButton
              size="large"
              edge="start"
              aria-label="logo"
              disableRipple
              onClick={() => handleSearch(search)}
            >
              <SearchIcon />
            </NoHoverIconButton>
          </SearchContainer>
        </div>
      )}
      {focus && localStorage.getItem("accessToken") && usersInfo.length > 0 && (
        <div
          onMouseLeave={() => setFocus(false)}
          style={{
            position: "absolute",
            top: "100%",
            right: "18px",
            left: "auto",
            width: "250px",
            backgroundColor: "#F7F7F7",
            padding: "5px 10px",
            boxShadow: "0px 0px 4px rgba(100, 111, 203, 0.6)",
            zIndex: 1,
          }}
        >
          {usersInfo.map((item, idx) => {
            return (
              <UserCard
                key={idx}
                firstName={item.firstName}
                lastName={item.lastName}
                userName={item.userName}
                email={item.email}
                isEmailVerified={item.isEmailVerified}
                phoneNumber={item.phoneNumber}
                isPhoneNumberVerified={item.isPhoneNumberVerified}
                handleOnClick={handleOnClick}
              />
            );
          })}
        </div>
      )}
      {selectedUser && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            zIndex: 9999,
          }}
        >
          <ChatBox
            selectedUser={selectedUser}
            closeChat={handleCloseChat}
            connection={connection}
            myUsername={userData.userName}
            channelId={channelId}
          />
        </div>
      )}
    </div>
  );
};

export const UserCard = (
  props: UserInfo & { handleOnClick: (value: string) => void }
) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <Card
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        onClick={() => props.handleOnClick(props.userName)}
        style={{
          border: "none",
          boxShadow: isHovered
            ? "0px 0px 10px rgba(100, 111, 203, 0.4)"
            : "none",
          height: "60px",
          width: "250px",
          display: "flex",
          margin: "5px 0px",
        }}
      >
        <CardContent
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          <div>
            <span
              style={{
                fontStyle: "italic",
                fontSize: "14px",
                color: "gray",
              }}
            >
              Username
            </span>
            <Typography
              style={{
                fontSize: "14px",
              }}
            >
              {props.userName}
            </Typography>
          </div>
          {!props.isEmailVerified && !props.isPhoneNumberVerified && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontStyle: "italic",
                  fontSize: "12px",
                  color: "gray",
                }}
              >
                Utilizator verificat
              </span>
              <VerifiedTwoToneIcon style={{ color: "#646FCB" }} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
