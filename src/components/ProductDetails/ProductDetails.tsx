import { useEffect, useState, useContext } from "react";
import { ChatBox } from "../Chat/Chatbox";
import { UserContext } from "../../context/UserContext";
import { HubConnection } from "@microsoft/signalr";
import {
  connectToHub,
  sendJoinChannel,
  sendLeaveChannel,
} from "../Chat/SignalR";
import {
  Category,
  Product,
  ProductContext,
} from "../../context/ProductsContext";
import { useParams } from "react-router-dom";
import { SwiperComponent } from "./Swiper";
import { Navbar } from "../Navbar/Navbar";
import {
  Alert,
  AlertTitle,
  Box,
  Rating,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
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
import React from "react";
import { addQuestion, addReview, getProduct } from "../../API/products";
import { Review } from "../Checkout/Review";
import { handleCartItems, handleFavorites } from "../Products/ProductCard";

export interface ChatMessage {
  date: string;
  username: string;
  message: string;
  channelId: string;
}

export interface ProductDetailsProps {
  product?: Product;
}

interface CategoryPathProps {
  categoryId: number;
  categories: Category[];
}

export const calculateAverageRating = (product: Product) => {
  if (product?.reviews.length === 0) {
    return 0;
  }

  const totalRating = product?.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const averageRating = totalRating! / product?.reviews.length;
  return +averageRating.toFixed(2);
};

export const ProductDetails = (props: ProductDetailsProps) => {
  const { userData, isAuthenticated } = useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [channelId, setChannelId] = useState<string>("");
  const [product, setProduct] = useState<Product | undefined>();
  const {
    products,
    categories,
    shoppingSession,
    setShoppingSession,
    favorites,
    setFavorites,
  } = useContext(ProductContext);
  const { productId } = useParams();
  const [search, setSearch] = useState("");

  const [ratingValue, setRatingValue] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCloseSnackbar = () => {
    setError(null);
  };

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
    } catch {}
  };

  const handleCloseChat = async () => {
    setSelectedUser(null);

    await sendLeaveChannel(connection, channelId);
  };

  const categoryTree = (
    categoryId: number,
    categories: Category[],
    currentPath: Category[] = []
  ): Category[] | undefined => {
    for (const category of categories) {
      if (category.categoryId === categoryId) {
        return [...currentPath, category];
      }

      if (category.subCategories) {
        const path = categoryTree(categoryId, category.subCategories, [
          ...currentPath,
          category,
        ]);
        if (path) {
          return path;
        }
      }
    }

    return undefined;
  };

  const returnPath = (
    categoryId: number,
    categories: Category[]
  ): { categoryName: string; categoryId: number }[] => {
    const path = categoryTree(categoryId, categories);

    if (path) {
      return path.map((category) => ({
        categoryName: category.categoryName,
        categoryId: category.categoryId,
      }));
    }

    return [];
  };

  const CategoryPath = (cat: CategoryPathProps) => {
    const path = returnPath(cat.categoryId, cat.categories);

    return (
      <Typography
        style={{ margin: "10px 0 0 50px ", fontSize: "15px", maxWidth: "70%" }}
      >
        {path.map((category, index) => (
          <React.Fragment key={category.categoryId}>
            <span
              style={{
                color: "#b84260",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {category.categoryName}
            </span>
            {index !== path.length - 1 && <span> &gt; </span>}
          </React.Fragment>
        ))}
      </Typography>
    );
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        const response = await getProduct({ productId });

        const prod = response.data.responseData;
        setProduct(prod);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReviewsComments = async (value: string) => {
    if (!ratingValue) {
      setError("Trebuie să selectezi o valoare pentru rating!");
      return;
    }

    try {
      const response = await addReview({
        title: "",
        comment: value,
        productId: productId!,
        rating: ratingValue,
      });

      setProduct((prevProduct) => {
        if (prevProduct) {
          const updateReviews = [
            ...prevProduct.reviews,
            {
              firstName: userData.firstName,
              lastName: userData.lastName,
              comment: value,
              createdAt: new Date().toDateString(),
              email: userData.email,
              username: userData.userName,
              rating: ratingValue,
              title: "",
              hasBoughtProduct: false,
            },
          ];
          return {
            ...prevProduct,
            reviews: updateReviews,
          };
        }
        return prevProduct;
      });

      setShowReviewForm(false);
      setRatingValue(0);
    } catch (e: any) {
      if (e.response.status === 401) {
        setError("Trebuie sa fii autentificat pentru a putea lăsa o recenzie");
      }
    }
  };

  const handleQuestionsComments = async (value: string) => {
    try {
      const response = await addQuestion({
        title: "",
        comment: value,
        productId: productId!,
        rating: ratingValue,
      });

      setProduct((prevProduct) => {
        if (prevProduct) {
          const updateComments = [
            ...prevProduct.comments,
            {
              firstName: userData.firstName,
              lastName: userData.lastName,
              comment: value,
              createdAt: new Date().toDateString(),
              username: userData.userName,
            },
          ];
          return {
            ...prevProduct,
            comments: updateComments,
          };
        }
        return prevProduct;
      });

      setShowCommentForm(false);
    } catch (e: any) {
      if (e.response.status === 401) {
        setError("Trebuie sa fii autentificat pentru a putea lăsa o întrebare");
      }
    }
  };

  return (
    <div>
      <Navbar />

      <CategoryPath
        categoryId={product?.categories.categoryId!}
        categories={categories}
      />
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
            onClick={() =>
              handleCartItems(
                1,
                product!,
                isAuthenticated,
                shoppingSession,
                setShoppingSession
              )
            }
          />
          <AutenticationButtons
            buttonText={"Adaugă la favorite"}
            buttonWidth={"60%"}
            style={{ marginTop: "40px", height: "50px", fontSize: "20px" }}
            onClick={() =>
              handleFavorites(
                product!,
                favorites,
                setFavorites,
                isAuthenticated
              )
            }
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
              <span style={{ fontSize: "40px" }}>
                {calculateAverageRating(product!)}
              </span>
              <Rating
                name="product-rating"
                precision={0.5}
                value={calculateAverageRating(product!)}
                readOnly
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
                {product?.reviews.length}{" "}
                {product?.reviews.length == 1 ? "recenzie" : "recenzii"}
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
                precision={0.2}
                style={{
                  fontSize: "36px",
                  marginTop: "10px",
                  marginLeft: "-2px",
                }}
                value={ratingValue}
                onChange={(event, value) => {
                  if (value !== null) {
                    setRatingValue(value);
                  }
                }}
              />
              <span>Ai achiziționat produsul ? </span>
              <AutenticationButtons
                buttonText={"Lasă o recenzie"}
                style={{ width: "60%", height: "30%" }}
                onClick={() => setShowReviewForm(true)}
              />
            </div>
          </div>
          {showReviewForm && (
            <div>
              <div className="gray-line" />
              <Reviews
                showForm={showReviewForm}
                saveReview={handleReviewsComments}
                closeReview={() => {
                  setShowReviewForm(false);
                  setRatingValue(0);
                }}
              />
            </div>
          )}
          {product?.reviews.length === 0 && !showReviewForm && (
            <div style={{ height: "80px", backgroundColor: "white" }}>
              <div className="gray-line" />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Typography>
                  Încă nu sunt recenzii pentru{" "}
                  <span style={{ fontStyle: "italic", color: "#b84260" }}>
                    {product.name}
                  </span>
                </Typography>
                <span
                  style={{
                    fontStyle: "italic",
                    color: "#b84260",
                    textDecoration: "underline",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                  onClick={() => setShowReviewForm(true)}
                >
                  Lasă o recenzie
                </span>
              </div>
            </div>
          )}
          {product?.reviews &&
            product.reviews.length > 0 &&
            product?.reviews.map((x, idx) => {
              return (
                <div key={idx}>
                  <div className="gray-line" />
                  <Reviews
                    onClick={() => handleSelectedUser(x.username)}
                    username={x.username}
                    message={x.comment}
                    initialsName={x.firstName[0] + x.lastName[0]}
                    date={x.createdAt}
                    rating={x.rating}
                  />
                </div>
              );
            })}
        </div>
        <div className="gray-line" />
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
              onClick={() => setShowCommentForm(true)}
              buttonText={"Adaugă o întrebare"}
              style={{ marginRight: "30px", width: "20%" }}
            />
          </div>
          {showCommentForm && (
            <div>
              <div className="gray-line" />
              <Comments
                showForm={showCommentForm}
                saveComment={handleQuestionsComments}
                closeComment={() => setShowCommentForm(false)}
              />
            </div>
          )}
          {product?.comments.length === 0 && !showCommentForm && (
            <div style={{ height: "80px", backgroundColor: "white" }}>
              <div className="gray-line" />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Typography>Ai vreo întrebare?</Typography>
                <span
                  style={{
                    fontStyle: "italic",
                    color: "#b84260",
                    textDecoration: "underline",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                  onClick={() => setShowCommentForm(true)}
                >
                  Adaugă una aici
                </span>
              </div>
            </div>
          )}
          {product?.comments &&
            product.comments.length > 0 &&
            product?.comments.map((x, idx) => {
              return (
                <div key={idx}>
                  <div className="gray-line" />
                  <Comments
                    onClick={() => handleSelectedUser(x.username)}
                    username={x.username}
                    message={x.comment}
                    initialsName={x.firstName[0] + x.lastName[0]}
                    date={x.createdAt}
                  />
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
