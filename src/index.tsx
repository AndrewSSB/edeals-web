import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { WelcomePage } from "./components/Welcome/WelcomePage";
import { UserContext, UserContextProvider } from "./context/UserContext";
import SignIn from "./components/Authentication/SignIn/SignIn";
import SignUp from "./components/Authentication/SignUp/SignUp";
import { NotFoundPage } from "./components/NotFound/NotFound";
import { ProductContextProvider } from "./context/ProductsContext";
import Payment from "./components/Payments/Payment";
import { SendbirdChat } from "./components/Chat/SendbirdChat";
import { Test } from "./components/Chat/Test";
import { AgoraChat } from "./components/Chat/AgoraChat";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import { Favorites } from "./components/Basket/Favorites";
import { Basket } from "./components/Basket/Basket";
import { Provider } from "react-redux";
import { ChatComponent } from "./components/Chat/SignalR";
import { ProductDetails } from "./components/ProductDetails/ProductDetails";

const App = () => {
  return (
    <UserContext.Consumer>
      {(userContext) => (
        <ProductContextProvider>
          <Router>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/basket" element={<Basket />} />
              <Route path="/favorite" element={<Favorites />} />
              <Route path="/payment" element={<Payment />} />
              {/* <Route path="/test" element={<Test />} /> */}
              {/* <Route path="/agora" element={<AgoraChat />} /> */}
              <Route path="/chat" element={<ChatComponent />} />
              <Route path="/product" element={<ProductDetails />} />
              {/* <Route
                path="/chat"
                element={
                  <SendbirdChat
                    applicationId={"1C60BCB2-8533-49C3-B140-EC377E9CF4FC"}
                    userId={"123456789"}
                    accessToken={""}
                  />
                }
              /> */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </ProductContextProvider>
      )}
    </UserContext.Consumer>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <UserContextProvider>
    <App />
  </UserContextProvider>
);
