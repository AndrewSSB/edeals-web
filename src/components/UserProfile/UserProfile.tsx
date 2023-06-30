import {
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Navbar } from "../Navbar/Navbar";
import { Address, UserContext } from "../../context/UserContext";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Grid,
  Rating,
  Slide,
  Snackbar,
  Typography,
  keyframes,
  styled,
} from "@mui/material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import VerifiedTwoToneIcon from "@mui/icons-material/VerifiedTwoTone";
import { NoHoverIconButton } from "../Navbar/NavbarElements";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import NewReleasesOutlinedIcon from "@mui/icons-material/NewReleasesOutlined";
import "./UserProfile.css";
import {
  getAddress,
  getConversations,
  getMyReviews,
  getUser,
} from "../../API/user";
import { sendJoinChannel, sendLeaveChannel } from "../Chat/SignalR";
import { ChatBox } from "../Chat/Chatbox";
import { getOrders } from "../../API/products";

interface ProfileDataProps {
  tag: string;
  text: string;
  style?: CSSProperties;
  disableLine?: boolean;
  isVerified?: boolean;
}

interface ProfileCardProps {
  title: string;
  children: ReactNode;
  expandButtonContent?: string;
  style?: CSSProperties;
}

const ProfileData = (props: ProfileDataProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const buttonTimer = useRef<NodeJS.Timeout | null>(null);
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
          <div
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <div
              style={{
                width: "40px",
                marginRight: "10px",
              }}
            >
              {props.isVerified && (
                <VerifiedTwoToneIcon
                  style={{ color: "#646FCB" }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
              )}
              {props.isVerified === false && (
                <NewReleasesOutlinedIcon
                  style={{ color: "#646FCB" }}
                  onMouseEnter={() => {
                    setShowButton(true);
                    clearTimeout(buttonTimer.current!);
                  }}
                  onMouseLeave={() => {
                    buttonTimer.current! = setTimeout(() => {
                      setShowButton(false);
                    }, 3000);
                  }}
                />
              )}
            </div>
            {showTooltip && props.isVerified && (
              <div
                style={{
                  position: "absolute",
                  backgroundColor: "#ffffff",
                  padding: "10px",
                  borderRadius: "5px",
                  boxShadow: "0px 2px 8px rgba(100, 111, 203, 0.6)",
                  top: "-60px",
                  left: "25%",
                  transform: "translateX(-50%)",
                  width: "100px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "18px", fontFamily: "sans-serif" }}>
                  Verified
                </span>
              </div>
            )}
            {showButton && (
              <button
                className="authentication-button"
                onMouseEnter={() => {
                  setShowButton(true);
                  clearTimeout(buttonTimer.current!);
                }}
                onMouseLeave={() => setShowButton(false)}
                onClick={() => {
                  // Handle button click logic here
                  console.log("Button clicked");
                }}
                style={{
                  cursor: "pointer",
                  border: "0",
                  borderRadius: "4px",
                  margin: 0,
                  width: "180px",
                  padding: "10px 0px",
                  transition: "0.4s",
                  textAlign: "center",
                  position: "absolute",
                  top: "-50px",
                  left: "25%",
                  transform: "translateX(-50%)",
                  ...props.style,
                }}
              >
                {`Verifică ${props.tag}`}
              </button>
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

const ScrollableContainer = styled(Box)`
  overflow: auto;
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
        className="profile-card"
        style={{
          marginTop: "40px",
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#646FCB transparent",
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};

const test = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface ReviewsAndQuestions {
  title: string;
  comment: string;
  rating?: number;
  hasBoughtProduct: boolean;
  isReview: boolean;
  createdAt: string;
}

interface Order {
  total: number;
  transportPrice: number;
  paymentType: string;
  country: string;
  city: string;
  region: string;
  postalCode: string;
  address: string;
  addressAditionally: string;
  mentiuni: string;
}

export const UserProfile = () => {
  const {
    userData,
    setUserData,
    conversations,
    setConversations,
    connection,
    setConnection,
    notification,
    setNotification,
  } = useContext(UserContext);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string>("");
  const [reviews, setReviews] = useState<ReviewsAndQuestions[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const [
          userResponse,
          addressResponse,
          myReviewsResponse,
          responseOrders,
        ] = await Promise.all([
          getUser(),
          getAddress(),
          getMyReviews(),
          getOrders(),
        ]);

        const userDetails = userResponse.data.responseData;
        const addresses = addressResponse.data.responseData;
        const myReviews = myReviewsResponse.data.responseData;
        const myOrders = responseOrders.data.responseData;

        userDetails.addresses = addresses;

        setUserData(userDetails);
        setReviews(myReviews);
        setOrders(myOrders);
      } catch (error: any) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      window.location.href = `/`;
    }
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await getConversations();

        const conversations = response.data;
        setConversations(conversations);
      } catch {
        console.log("ceva n-a mers in conversations");
      }
    };

    fetchConversations();
  }, []);

  const handleCloseChat = async () => {
    setSelectedUser(null);

    await sendLeaveChannel(connection, channelId);
  };

  const handleSelectedUser = async (user: string) => {
    if (!userData.userName) {
      setError("Trebuie să fii conectat pentru a comunica cu alți utilizatori");
      return;
    }

    if (user === userData.userName) {
      setError("Nu-ți poți trimite mesaje ție!");
      return;
    }

    setSelectedUser(user);

    try {
      setChannelId(userData.userName + "__" + user);
      await sendJoinChannel(connection, userData.userName + "__" + user);
    } catch {
      setError("Ceva nu a mers cum trebuie - hub");
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

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
                text={userData.email}
                isVerified={userData.isEmailVerified}
              />
              <ProfileData
                tag="Numărul de telefon"
                text={userData.phoneNumber}
                isVerified={userData.isPhoneNumberVerified}
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
                  height: "30px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  marginBottom: "15px",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "16px",
                  }}
                >
                  HAIDEBA
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
              {/* {orders.length === 0 && (
                <span
                  style={{
                    fontStyle: "italic",
                    fontSize: "16px",
                  }}
                >
                  Nu ai nicio reducere personală activă
                </span>
              )} */}
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
                wordBreak: "break-word",
              }}
            >
              {userData.addresses &&
                userData.addresses.map((address, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      style={{
                        fontSize: "16px",
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                        justifyContent: "start",
                      }}
                    >
                      {address.country}, {address.region}, {address.city},{" "}
                      {address.address}, {address.addressAditionally},{" "}
                      {address.postalCode}
                    </Typography>
                    <NoHoverIconButton style={{ justifyContent: "end" }}>
                      <ContentCopyOutlinedIcon style={{ color: "#646FCB" }} />
                    </NoHoverIconButton>
                  </div>
                ))}
              {userData.addresses && userData.addresses.length === 0 && (
                <span
                  style={{
                    fontStyle: "italic",
                    fontSize: "16px",
                  }}
                >
                  Nu ai nicio adresă salvată
                </span>
              )}
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
              {orders.map((item, idx) => (
                <div>
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      width: "400px",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        justifyContent: "left",
                      }}
                    >
                      <span
                        style={{
                          fontStyle: "italic",
                          fontSize: "16px",
                        }}
                      >
                        {item.country}, {item.region}, {item.city},{" "}
                        {item.address}, {item.addressAditionally},{" "}
                        {item.postalCode}
                      </span>
                      <span
                        style={{
                          fontStyle: "italic",
                          fontSize: "16px",
                          marginTop: "10px",
                          color: "gray",
                        }}
                      >
                        Total: {item.total} lei
                      </span>
                      <span
                        style={{
                          fontStyle: "italic",
                          fontSize: "16px",
                          marginTop: "10px",
                          color: "gray",
                        }}
                      >
                        Transport: {item.transportPrice} lei
                      </span>
                      <span
                        style={{
                          fontStyle: "italic",
                          fontSize: "16px",
                          marginTop: "10px",
                          color: "gray",
                        }}
                      >
                        Tip plata: {item.paymentType}
                      </span>
                    </div>
                    <NoHoverIconButton>
                      <OpenInNewOutlinedIcon style={{ color: "#646FCB" }} />
                    </NoHoverIconButton>
                  </div>
                  <div
                    style={{
                      border: "1px solid #e0e0e0",
                      width: "auto",
                      marginBottom: "15px",
                    }}
                  />
                </div>
              ))}
              {orders && orders.length === 0 && (
                <span
                  style={{
                    fontStyle: "italic",
                    fontSize: "16px",
                  }}
                >
                  Nu ai nicio comanda plasată
                </span>
              )}
            </ProfileCard>
          </Grid>
          <Grid item>
            <ProfileCard
              title={"Conversațiile mele"}
              style={{
                height: "430px",
                width: "300px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {conversations.map((conv, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    width: "300px",
                    height: "40px",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "15px",
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
                      variant="h6"
                      style={{
                        fontSize: "16px",
                      }}
                    >
                      {conv.receiverUsername}
                    </Typography>
                  </div>
                  <NoHoverIconButton
                    onClick={() => handleSelectedUser(conv.receiverUsername)}
                  >
                    <MessageOutlinedIcon style={{ color: "#646FCB" }} />
                  </NoHoverIconButton>
                </div>
              ))}
              {conversations && conversations.length === 0 && (
                <span
                  style={{
                    fontStyle: "italic",
                    fontSize: "16px",
                  }}
                >
                  Nu ai nicio conversație
                </span>
              )}
            </ProfileCard>
          </Grid>
          <Grid item>
            <ProfileCard
              title={"Review-urile și întrebările mele"}
              style={{
                height: "430px",
                width: "300px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {reviews.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    width: "350px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        style={{
                          fontSize: "16px",
                          justifyContent: "start",
                        }}
                      >
                        <span
                          style={{
                            fontStyle: "italic",
                            fontSize: "14px",
                            color: "gray",
                          }}
                        >
                          {item.isReview ? "Recenzie" : "Întrebare"}
                        </span>
                      </Typography>
                      <span
                        style={{
                          fontStyle: "italic",
                          fontSize: "14px",
                          color: "gray",
                          marginLeft: "10px",
                          marginBottom: "-2px",
                        }}
                      >
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {item.rating && (
                      <Rating
                        precision={0.2}
                        style={{
                          fontSize: "12px",
                        }}
                        value={item.rating}
                        readOnly
                      />
                    )}

                    <Typography
                      variant="h6"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.comment}
                    </Typography>
                  </div>

                  <NoHoverIconButton
                    style={{
                      justifyContent: "end",
                    }}
                  >
                    <OpenInNewOutlinedIcon style={{ color: "#646FCB" }} />
                  </NoHoverIconButton>
                </div>
              ))}
              {reviews && reviews.length === 0 && (
                <span
                  style={{
                    fontStyle: "italic",
                    fontSize: "16px",
                  }}
                >
                  Nu ai nicio recenzie sau întrebare lăsată
                </span>
              )}
            </ProfileCard>
          </Grid>
        </Grid>
        <div style={{ marginBottom: "20px" }} />
      </div>
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
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        message={error}
        onClose={handleCloseSnackbar}
        TransitionComponent={Slide}
        TransitionProps={{ timeout: 500 }}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Snackbar>
    </Grid>
  );
};
