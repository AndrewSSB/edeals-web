import { CSSProperties, ReactNode, useContext, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { UserContext } from "../../context/UserContext";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Typography,
  keyframes,
  styled,
} from "@mui/material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import VerifiedTwoToneIcon from "@mui/icons-material/VerifiedTwoTone";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { NoHoverIconButton } from "../Navbar/NavbarElements";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

interface ProfileDataProps {
  tag: string;
  text: string;
  style?: CSSProperties;
  disableLine?: boolean;
  isVerified?: Boolean;
}

interface ProfileCardProps {
  title: string;
  children: ReactNode;
  expandButtonContent?: string;
  style?: CSSProperties;
}

const ProfileData = (props: ProfileDataProps) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          margin: "30px 30px -10px 20px",
        }}
      >
        <Typography variant="h6" style={{ color: "#6b6b6b" }}>
          {props.tag}
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "30px",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              fontStyle: "italic",
              fontSize: "16px",
              marginRight: "30px",
            }}
          >
            {props.text}
          </Typography>
          <div style={{ width: "40px", marginRight: "10px" }}>
            {props.isVerified && (
              <VerifiedTwoToneIcon style={{ color: "#646FCB" }} />
            )}
          </div>
          <EditTwoToneIcon style={{ color: "#646FCB" }} />
        </div>
      </div>
      {!props.disableLine && (
        <div
          style={{
            borderBottom: "1px solid #ccc",
            margin: "10px 20px",
            ...props.style,
          }}
        />
      )}
    </div>
  );
};

const bounceAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0);
  }
`;

const BouncingIcon = styled("span")`
  display: inline-block;
  animation: ${bounceAnimation} 1.5s infinite;
`;

const ProfileCard = (props: ProfileCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      style={{
        backgroundColor: "white",
        padding: "10px 40px 40px 40px",
        borderRadius: "5px",
        width: "auto",
        maxWidth: "400px",
        height: expanded ? "fit-content" : "300px",
        overflow: "hidden",
        boxShadow: "0px 0px 10px rgba(100, 111, 203, 0.6)",
        ...props.style,
      }}
    >
      <Typography
        variant="h6"
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
        }}
      >
        {props.title}
      </Typography>
      <Box
        style={{
          height: expanded ? "auto" : "calc(100% - 48px)",
          overflow: "hidden",
        }}
      >
        {props.children}
      </Box>
      {!expanded && (
        <NoHoverIconButton
          onClick={toggleExpansion}
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <BouncingIcon
            style={{
              color: "#646FCB",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <KeyboardDoubleArrowDownIcon />
          </BouncingIcon>
        </NoHoverIconButton>
      )}
    </Box>
  );
};

export const UserProfile = () => {
  const { userData, setUserData } = useContext(UserContext);

  return (
    <Grid item xs={8} sm={4} md={3} lg={2}>
      <div style={{ backgroundColor: "#F7F7F7", minHeight: "100vh" }}>
        <Navbar />
        <Grid
          container
          spacing={2}
          justifyContent="space-evenly"
          marginTop="30px"
        >
          <Grid item>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                width: "480px",
                height: "480px",
                maxWidth: "520px",
                maxHeight: "540px",
                boxShadow: "0px 0px 10px rgba(100, 111, 203, 0.6)",
              }}
            >
              <Typography
                variant="h6"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "10px",
                }}
              >
                Contul meu
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                {userData && userData.profileImage ? (
                  <Avatar
                    alt="User Image"
                    src={userData.profileImage}
                    sx={{ width: "80px", height: "80px" }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      bgcolor: "#646FCB",
                      color: "#fff",
                      fontSize: 36,
                      width: "80px",
                      height: "80px",
                    }}
                  >
                    {userData.firstName && userData.lastName
                      ? userData.firstName?.charAt(0) +
                        userData.lastName?.charAt(0)
                      : ""}
                  </Avatar>
                )}
              </div>
              <ProfileData tag="First name" text={userData.firstName} />
              <ProfileData tag="Last name" text={userData.lastName} />
              <ProfileData tag="Username" text={userData.firstName} />
              <ProfileData
                tag="Email"
                text={"test@gmail.com"}
                isVerified={true}
              />
              <ProfileData
                tag="Phone number"
                text={"+40741385734"}
                isVerified={true}
              />
            </Box>
          </Grid>
          <Grid item>
            <ProfileCard
              title="Reduceri Personale"
              style={{
                height: "430px",
                width: "300px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "400px",
                  height: "40px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  margin: "30px 20px 0px 20px",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "16px",
                  }}
                >
                  HQTESA
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "14px",
                    fontStyle: "italic",
                  }}
                >
                  20% orice produs
                </Typography>
                <NoHoverIconButton>
                  <ContentCopyOutlinedIcon style={{ color: "#646FCB" }} />
                </NoHoverIconButton>
              </div>
            </ProfileCard>
          </Grid>
          <Grid item>
            <ProfileCard
              title="Adresele mele"
              style={{
                height: "430px",
                width: "340px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "400px",
                  height: "40px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  margin: "30px 20px 0px 20px",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "16px",
                  }}
                >
                  Strada Academiei 14, București 010014
                </Typography>
                <NoHoverIconButton>
                  <ContentCopyOutlinedIcon style={{ color: "#646FCB" }} />
                </NoHoverIconButton>
              </div>
            </ProfileCard>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          justifyContent="space-evenly"
          marginTop="30px"
        >
          <Grid item>
            <ProfileCard
              title="Comenzile mele"
              style={{
                height: "430px",
                width: "350px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "400px",
                  height: "40px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  margin: "30px 20px 0px 20px",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "16px",
                  }}
                >
                  Strada Academiei 14, București 010014
                </Typography>
                <NoHoverIconButton>
                  <OpenInNewOutlinedIcon style={{ color: "#646FCB" }} />
                </NoHoverIconButton>
              </div>
            </ProfileCard>
          </Grid>
          <Grid item>
            <ProfileCard
              title={"Conversațiie mele"}
              style={{
                height: "430px",
                width: "300px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "400px",
                  height: "40px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  margin: "30px 20px 0px 20px",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "16px",
                  }}
                >
                  Bogdan
                </Typography>
                <NoHoverIconButton>
                  <MessageOutlinedIcon style={{ color: "#646FCB" }} />
                </NoHoverIconButton>
              </div>
            </ProfileCard>
          </Grid>
          <Grid item>
            <ProfileCard
              title={"Review-urile mele"}
              style={{
                height: "430px",
                width: "300px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "400px",
                  height: "40px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  margin: "30px 20px 0px 20px",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "16px",
                  }}
                >
                  Sistem all in one
                </Typography>
                <NoHoverIconButton>
                  <OpenInNewOutlinedIcon style={{ color: "#646FCB" }} />
                </NoHoverIconButton>
              </div>
            </ProfileCard>
          </Grid>
        </Grid>
        <div style={{ marginBottom: "20px" }} />
      </div>
    </Grid>
  );
};
