import { useEffect, useState, useContext } from "react";
import { ChatBox } from "../Chat/Chatbox";
import { UserContext } from "../../context/UserContext";
import { HubConnection } from "@microsoft/signalr";
import {
  connectToHub,
  sendJoinChannel,
  sendLeaveChannel,
} from "../Chat/SignalR";
import { Product, ProductContext } from "../../context/ProductsContext";
import { useParams } from "react-router-dom";
import { SwiperComponent } from "./Swiper";
import { Navbar } from "../Navbar/Navbar";
import { Box, Rating, Typography } from "@mui/material";
import { AutenticationButtons } from "../CustomButtons/CustomButtons";
import {
  NoHoverIconButton,
  SearchContainer,
  SearchInput,
} from "../Navbar/NavbarElements";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { Comments } from "./Comments";
import "./Swiper.css";
import { Reviews } from "./Reviews";

export interface ChatMessage {
  date: string;
  username: string;
  message: string;
  channelId: string;
}

export interface ProductDetailsProps {
  product?: Product;
}

export const ProductDetails = (props: ProductDetailsProps) => {
  const { userData } = useContext(UserContext);
  const [username, setUsername] = useState("Haideeee");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [channelId, setChannelId] = useState<string>("");
  const [product, setProduct] = useState<Product | undefined>();
  const { products } = useContext(ProductContext);
  const { productId } = useParams();
  const [search, setSearch] = useState("");

  const handleSearch = async (value: string | null) => {
    console.log("Seaching...");
  };

  const searchChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(search);
    }
  };

  const clearSearch = () => {
    setSearch("");
    handleSearch(null);
  };

  useEffect(() => {
    const getConnection = async () => {
      try {
        const response = await connectToHub();
        setConnection(response);
      } catch {}
    };

    getConnection();
  }, []);

  const handleSelectedUser = async (user: string) => {
    setSelectedUser(user);

    try {
      setChannelId(userData.userName + "__" + user);
      await sendJoinChannel(connection, userData.userName + "__" + user);
    } catch {}
  };

  const handleCloseChat = async () => {
    setSelectedUser(null);

    await sendLeaveChannel(connection, channelId);
  };

  // SlideShowProductImages(product?.images.scrollImages);

  useEffect(() => {
    const produs = products.find((x) => x.productId === productId);
    setProduct(produs);
  }, []);

  const test = [1, 2, 3, 4, 5];

  return (
    <div>
      <Navbar />
      <Typography
        style={{ margin: "10px 0 0 50px ", fontSize: "15px", maxWidth: "70%" }}
      >
        <span style={{ color: "#b84260" }}>
          Calculatoare si accesorii {">"} Calculatoare si Monitoare
        </span>
      </Typography>
      <Typography
        style={{ margin: "50px 0 0 50px ", fontSize: "20px", maxWidth: "70%" }}
      >
        {product?.description}
      </Typography>
      <Typography
        style={{
          margin: "30px 0 0 50px ",
          fontSize: "15px",
          fontStyle: "italic",
        }}
      >
        Produs vândut și livrat de{" "}
        <span
          style={{
            color: "#b84260",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {product?.seller.name}
        </span>
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SwiperComponent images={product?.images.scrollImages} />
        <Box
          sx={{
            marginRight: "8%",
            backgroundColor: "white",
            borderRadius: "5px",
            minWidth: "350px",
            height: "300px",
            maxHeight: "460px",
            boxShadow: "0px 0px 20px rgba(100, 111, 203, 0.3)",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            style={{
              margin: "20px 0 20px 20px",
              fontWeight: "bold",
              color: "#646FCB",
              fontSize: "22px",
            }}
          >
            Preț {product?.price} lei
          </Typography>
          <AutenticationButtons
            buttonText={"Adaugă în coș"}
            buttonWidth={"60%"}
            style={{
              marginTop: "40px",
              height: "50px",
              fontSize: "20px",
            }}
          />
          <AutenticationButtons
            buttonText={"Adaugă la favorite"}
            buttonWidth={"60%"}
            style={{ marginTop: "40px", height: "50px", fontSize: "20px" }}
          />
        </Box>
      </div>

      <section
        className="review-section"
        style={{
          backgroundColor: "#F7F7F7",
          marginTop: "50px",
          boxShadow: "0 0px 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            height: "80px",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              marginLeft: "10px",
              fontSize: "22px",
              maxWidth: "70%",
            }}
          >
            Recenzii și Întrebări
          </Typography>
          <SearchContainer style={{ maxWidth: "300px", height: "50px" }}>
            <SearchInput
              placeholder="Caută o recenzie sau întrebare"
              color="primary"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={searchChange}
              sx={{
                paddingLeft: "5px",
              }}
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
        <div className="gray-line" />
        <div style={{ height: "60px", display: "flex", alignItems: "center" }}>
          <Typography style={{ fontSize: "18px", marginLeft: "10px" }}>
            Recenzii
          </Typography>
        </div>
        <div className="gray-line" />
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "150px",
              justifyContent: "space-evenly",
              margin: "15px 0px 15px 0px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "20px 0px 20px 40px",
              }}
            >
              <span style={{ fontSize: "40px" }}>5.00</span>
              <Rating
                name="product-rating"
                precision={0.5}
                style={{
                  fontSize: "36px",
                  marginTop: "10px",
                  marginLeft: "-2px",
                }}
              />
              <span
                style={{
                  fontSize: "15px",
                  marginTop: "10px",
                  fontStyle: "italic",
                }}
              >
                10 recenzii
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                width: "20%",
              }}
            >
              <Rating
                name="product-rating"
                precision={0.5}
                style={{
                  fontSize: "36px",
                  marginTop: "10px",
                  marginLeft: "-2px",
                }}
              />
              <span>Ai achiziționat produsul ? </span>
              <AutenticationButtons
                buttonText={"Lasă o recenzie"}
                style={{ width: "60%", height: "30%" }}
              />
            </div>
          </div>
          {test.map((x, idx) => {
            return (
              <div key={idx}>
                <div className="gray-line" />
                <Reviews onClick={() => handleSelectedUser("Ene")} />
              </div>
            );
          })}
        </div>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "15px",
              marginBottom: "15px",
            }}
          >
            <Typography style={{ fontSize: "18px", marginLeft: "10px" }}>
              Întrebări și răspunsuri
            </Typography>
            <AutenticationButtons
              buttonText={"Adaugă o întrebare"}
              style={{ marginRight: "30px", width: "20%" }}
            />
          </div>
          {test.map((x, idx) => {
            return (
              <div key={idx}>
                <div className="gray-line" />
                <Comments onClick={() => handleSelectedUser("Ene")} />
              </div>
            );
          })}
        </div>
      </section>

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
