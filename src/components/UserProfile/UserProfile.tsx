import { CSSProperties, ReactNode, useContext } from "react";
import { Navbar } from "../Navbar/Navbar";
import { UserContext } from "../../context/UserContext";
import { Avatar, Box, Typography } from "@mui/material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import VerifiedTwoToneIcon from "@mui/icons-material/VerifiedTwoTone";

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
        <Typography
          style={{
            fontStyle: "italic",
            fontSize: "16px",
          }}
        >
          {props.text}
        </Typography>
        {props.isVerified && (
          <VerifiedTwoToneIcon style={{ color: "#646FCB" }} />
        )}
        <EditTwoToneIcon style={{ color: "#646FCB" }} />
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

const test = [1, 2, 3, 4, 5, 6, 7, 8, 10];

const ProfileCard = (props: ProfileCardProps) => {
  return (
    <Box
      style={{
        backgroundColor: "white",
        padding: "10px 40px 40px 40px",
        borderRadius: "5px",
        width: "auto",
        maxWidth: "400px",
        height: "fit-content",
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
        {props.title}
      </Typography>
      {props.children}
    </Box>
  );
};

export const UserProfile = () => {
  const { userData, setUserData } = useContext(UserContext);

  return (
    <div style={{ backgroundColor: "#F7F7F7", minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: "20px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "5px",
            width: "480px",
            height: "470px",
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
            Contul tău
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
                  ? userData.firstName?.charAt(0) + userData.lastName?.charAt(0)
                  : ""}
              </Avatar>
            )}
          </div>
          <ProfileData tag="First name" text={userData.firstName} />
          <ProfileData tag="Last name" text={userData.lastName} />
          <ProfileData tag="Username" text={userData.firstName} />
          <ProfileData
            tag="Email"
            text={userData.email}
            isVerified={userData.isEmailVerified}
          />
          <ProfileData
            tag="Phone number"
            text={userData.phoneNumber}
            isVerified={userData.isPhoneNumberVerified}
          />
        </Box>

        <ProfileCard title="Reduceri Personale">
          {test.map((item, idx) => {
            return (
              <div key={idx} style={{ marginTop: "20px" }}>
                Phasellus rhoncus arcu neque.
              </div>
            );
          })}
        </ProfileCard>
        <ProfileCard title="Adresele mele">
          {test.map((item, idx) => {
            return (
              <div key={idx} style={{ marginTop: "20px" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus rhoncus arcu neque,
              </div>
            );
          })}
        </ProfileCard>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <ProfileCard title={""}>
          <div>sal</div>
        </ProfileCard>
        <ProfileCard title={""}>
          <div>sal</div>
        </ProfileCard>
      </div>
    </div>
  );
};
