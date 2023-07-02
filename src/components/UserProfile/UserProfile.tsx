import {
  CSSProperties,
  ChangeEvent,
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
  closeAccount,
  confirmPhoneNumber,
  getAddress,
  getConversations,
  getMyReviews,
  getUser,
  sendEmailVerificationCode,
  sendPhoneVerificationCode,
  updateUser,
} from "../../API/user";
import {
  sendJoinChannel,
  sendJoinNotificationChannel,
  sendLeaveChannel,
} from "../Chat/SignalR";
import { ChatBox } from "../Chat/Chatbox";
import { getOrders } from "../../API/products";
import { ChatContext } from "../../context/ChatContext";
import { AutenticationButtons } from "../CustomButtons/CustomButtons";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

interface ProfileDataProps {
  index: number;
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

interface ValidateInputProps {
  tag: string;
  code: string;
  setCode: (value: string) => void;
  handleValidate: (value: string) => void;
}

const ValidateInput = (props: ValidateInputProps) => {
  const [niceCode, setNiceCode] = useState<string>("");

  const handleCodeChange = (e: string) => {
    const code = e.replace(/\D/g, "").slice(0, 6);

    props.setCode(code);

    const first = code.slice(0, 3).split("").join(" ");
    const second = code.slice(3, 6).split("").join(" ");

    const formattedCode = first + (second ? " - " + second : "");
    setNiceCode(formattedCode);
  };

  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center ",
        width: "100%",
      }}
    >
      <span
        style={{
          fontStyle: "italic",
          fontSize: "16px",
          textAlign: "center",
        }}
      >
        Ți-am trimis un cod de verificare pe{" "}
        {props.tag.toLowerCase() === "email" ? "email" : "telefon"}
      </span>
      <input
        id="discount"
        placeholder="9 4 1 - 8 5 3"
        type="text"
        style={{
          marginTop: "10px",
          width: "100px",
          wordSpacing: "2px",
          textAlign: "center",
        }}
        value={niceCode}
        onChange={(event) => handleCodeChange(event.target.value)}
      />
      <AutenticationButtons
        buttonText={`Verifică ${
          props.tag.toLowerCase() === "email" ? "emailul" : "telefonul"
        }`}
        buttonWidth={"120px"}
        style={{ height: "40px", marginTop: "20px" }}
        onClick={() => props.handleValidate(props.code)}
      />
    </div>
  );
};

interface updateUser {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  email: string | null | undefined;
  phoneNumber: string | null | undefined;
  username: string | null | undefined;
}

const ProfileData = (props: ProfileDataProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [validateEmail, setValidateEmail] = useState(false);
  const [validatePhone, setValidatePhone] = useState(false);
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(props.isVerified);
  const [edit, setEdit] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [hasBeenEdited, setHasBeenEdited] = useState(false);

  useEffect(() => {
    setIsVerified(props.isVerified);
  }, [props.isVerified]);

  const setEmailOrPhone = async (value: string) => {
    if (value === "Email" || value === "email") {
      try {
        await sendEmailVerificationCode();
        setValidateEmail(true);
      } catch (ex: any) {
        setValidateEmail(false);
        setError(ex.response.data.errors[0].description);
      }
      return;
    }

    try {
      await sendPhoneVerificationCode();
      setValidatePhone(true);
    } catch (ex: any) {
      setError(ex.response.data.errors[0].description);
      if (ex.response.data.errors[0].code !== 202) {
        setValidatePhone(false);
      }
    }
    return;
  };

  const handleValidate = async (digitCode: string) => {
    if (validateEmail) {
    }

    if (validatePhone) {
      try {
        await confirmPhoneNumber(digitCode);
        setIsVerified(true);
        setShowVerification(false);
      } catch (err: any) {
        setError(err.response.data.errors[0].description);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  const updateUserInfo = async (index: number, value: string) => {
    if (value !== "") {
      let userInfoValues: updateUser = {
        firstName: null,
        lastName: null,
        email: null,
        phoneNumber: null,
        username: null,
      };

      switch (index) {
        case 1:
          userInfoValues.firstName = value;
          break;
        case 2:
          userInfoValues.lastName = value;
          break;
        case 3:
          userInfoValues.username = value;
          break;
        case 4:
          userInfoValues.email = value;
          setIsVerified(false);
          break;
        case 5:
          userInfoValues.phoneNumber = value;
          setIsVerified(false);
          break;
        default:
          return;
      }

      try {
        await updateUser(userInfoValues);
        setEdit(false);
        setHasBeenEdited(true);
      } catch (ex: any) {
        console.log(ex);
      }
    }
  };

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
          {edit === false ? (
            <Typography
              style={{
                fontStyle: "italic",
                fontSize: "16px",
                marginRight: "30px",
              }}
            >
              {hasBeenEdited ? editValue : props.text}
            </Typography>
          ) : (
            <input
              type="text"
              value={editValue}
              placeholder={props.text}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              style={{
                fontStyle: "italic",
                width: "200px",
                textAlign: "right",
                fontSize: "16px",
                border: "none",
                outline: "none",
              }}
            />
          )}

          <div
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <div
              style={{
                width: "30px",
                display: "flex",
                justifyContent: "center",
                marginRight: "5px",
              }}
            >
              {isVerified && !edit && (
                <VerifiedTwoToneIcon
                  style={{
                    color: "#646FCB",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
              )}
              {isVerified === false && edit === false && (
                <NewReleasesOutlinedIcon
                  style={{ color: "red", cursor: "pointer" }}
                  onMouseEnter={() => {
                    setShowVerification(true);
                    clearTimeout(buttonTimer.current!);
                  }}
                  onMouseLeave={() => {
                    buttonTimer.current! = setTimeout(() => {
                      setShowVerification(false);
                    }, 3000);
                  }}
                />
              )}
            </div>
            {showTooltip && isVerified && (
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
            {showVerification && (
              <div
                onMouseEnter={() => {
                  setShowVerification(true);
                  clearTimeout(buttonTimer.current!);
                }}
                onMouseLeave={() => setShowVerification(false)}
                style={{
                  position: "absolute",
                  bottom: "100%",
                  marginBottom: "20px",
                  left: "50%",
                  transform: "translateX(-55%)",
                  width: "250px",
                  backgroundColor: "#fff",
                  borderRadius: "5px",
                  boxShadow: "0px 2px 8px rgba(100, 111, 203, 0.6)",
                  padding: "10px",
                  zIndex: "1",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography style={{ marginTop: "10px" }}>
                  Nu ai{" "}
                  {props.tag.toLowerCase() === "email"
                    ? "email-ul"
                    : props.tag.toLowerCase()}{" "}
                  verificat
                </Typography>
                <AutenticationButtons
                  buttonText={`Trimite-mi codul`}
                  buttonWidth={"120px"}
                  style={{ height: "40px", marginTop: "20px" }}
                  onClick={() => setEmailOrPhone(props.tag)}
                />
                {validateEmail && (
                  <span
                    style={{
                      fontStyle: "italic",
                      fontSize: "16px",
                      textAlign: "center",
                      marginTop: "15px",
                    }}
                  >
                    Ți-am trimis un email de verificare
                  </span>
                )}
                {validatePhone && (
                  <ValidateInput
                    tag={props.tag}
                    code={code}
                    setCode={setCode}
                    handleValidate={handleValidate}
                  />
                )}
              </div>
            )}
          </div>

          {edit === false ? (
            <NoHoverIconButton
              onClick={() => setEdit(true)}
              style={{ width: "30px", height: "30px" }}
            >
              <EditTwoToneIcon style={{ color: "#646FCB" }} />
            </NoHoverIconButton>
          ) : (
            <div>
              <NoHoverIconButton
                style={{ width: "30px", height: "30px" }}
                onClick={() => setEdit(false)}
              >
                <ClearIcon style={{ color: "#646FCB" }} />
              </NoHoverIconButton>
              <NoHoverIconButton
                style={{ width: "30px", height: "30px" }}
                onClick={() => updateUserInfo(props.index, editValue)}
              >
                <CheckIcon style={{ color: "#646FCB" }} />
              </NoHoverIconButton>
            </div>
          )}
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
    </div>
  );
};

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
    channelId,
    setChannelId,
  } = useContext(UserContext);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
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
    setChannelId("");
    try {
      await sendLeaveChannel(connection, channelId);
      await sendJoinNotificationChannel(connection);
    } catch {}
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
    setNotification(
      notification.filter(
        (notif) => notif.receiver !== userData.userName && notif.sender !== user
      )
    );

    try {
      setChannelId(userData.userName + "__" + user);
      await sendJoinChannel(connection, userData.userName + "__" + user);
      await sendLeaveChannel(connection, "generic");
    } catch {
      setError("Ceva nu a mers cum trebuie - hub");
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const displayAddress = (address: Address) => {
    let niceAddress = address.address ?? "";
    if (address.addressAditionally !== "" && address.addressAditionally) {
      niceAddress = niceAddress + ", " + address.addressAditionally;
    }
    if (address?.country !== "" && address.country) {
      niceAddress = niceAddress + ", " + address.country;
    }
    if (address?.region !== "" && address.region) {
      niceAddress = niceAddress + ", " + address.region;
    }
    if (address?.city !== "" && address.city) {
      niceAddress = niceAddress + ", " + address.city;
    }
    if (address?.postalCode !== "" && address.postalCode) {
      niceAddress = niceAddress + ", " + address.postalCode;
    }

    return niceAddress;
  };

  const deleteAccount = async () => {
    try {
      await closeAccount();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    } catch (ex: any) {
      console.log(ex);
      setError("Ceva nu a mers, încearca din nou mai târziu");
    }
  };

  function copyTextToClipboard(text: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Use Clipboard API if available
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Text copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying text to clipboard:", error);
        });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const successful = document.execCommand("copy");
        const message = successful
          ? "Text copied to clipboard"
          : "Failed to copy text to clipboard";
        console.log(message);
      } catch (error) {
        console.error("Error copying text to clipboard:", error);
      }

      document.body.removeChild(textarea);
    }
  }

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
                height: "530px",
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
              <ProfileData
                index={1}
                tag="First name"
                text={userData.firstName}
              />
              <ProfileData index={2} tag="Last name" text={userData.lastName} />
              <ProfileData index={3} tag="Username" text={userData.userName} />
              <ProfileData
                index={4}
                tag="Email"
                text={userData.email}
                isVerified={userData.isEmailVerified}
              />
              <ProfileData
                index={5}
                tag="Telefon"
                text={userData.phoneNumber}
                isVerified={userData.isPhoneNumberVerified}
              />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <AutenticationButtons
                  onClick={deleteAccount}
                  buttonText={"Închide cont"}
                  className="deleteButton"
                  style={{
                    width: "50%",
                    marginTop: "10px",
                    backgroundColor: "#ff1a1a",
                    color: "white",
                  }}
                />
              </div>
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
                <NoHoverIconButton
                  onClick={() => copyTextToClipboard("HAIDEBA")}
                >
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
                      {displayAddress(address)}
                    </Typography>
                    <NoHoverIconButton
                      onClick={() =>
                        copyTextToClipboard(displayAddress(address))
                      }
                      style={{ justifyContent: "end" }}
                    >
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
                    margin: "0px 10px 15px 10px",
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
                    onClick={() => {
                      handleSelectedUser(conv.receiverUsername);
                    }}
                  >
                    <MessageOutlinedIcon style={{ color: "#646FCB" }} />
                    {notification.filter(
                      (x) => x.sender === conv.receiverUsername
                    ).length > 0 && (
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          position: "absolute",
                          backgroundColor: "red",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "14px",
                          color: "white",
                          left: "23px",
                          top: "2px",
                        }}
                      >
                        !
                      </div>
                    )}
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
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        message={success}
        onClose={handleCloseSnackbar}
        TransitionComponent={Slide}
        TransitionProps={{ timeout: 500 }}
      >
        <Alert severity="success" onClose={handleCloseSnackbar}>
          <AlertTitle>Success</AlertTitle>
          {success}
        </Alert>
      </Snackbar>
    </Grid>
  );
};
