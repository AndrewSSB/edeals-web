type apiUrls = {
  login: string;
  register: string;
  logout: string;
  userInfo: string;
  getProducts: string;
  addFavorite: string;
  deleteFavorite: string;
  getFavorite: string;
  getCartItems: string;
  addCartItem: string;
  deleteCartItem: string;
  getShoppingSession: string;

  paymentIntent: string;
  messages: string;
};

export const ApiUrls: apiUrls = {
  login: "http://40.113.124.53:5000/core/api/authentication/login",
  register: "http://40.113.124.53:5000/core/api/authentication/register",
  logout: "http://40.113.124.53:5000/core/api/authentication/logout",
  userInfo: "http://40.113.124.53:5000/core/api/user/info",

  getProducts: "http://40.113.124.53:5000/catalog/api/product/all",

  addFavorite: "http://40.113.124.53:5000/catalog/api/favorites",
  deleteFavorite: "http://40.113.124.53:5000/catalog/api/favorites",
  getFavorite: "http://40.113.124.53:5000/catalog/api/favorites",

  getShoppingSession: "http://40.113.124.53:5000/catalog/api/shoppingsession",
  getCartItems: "http://40.113.124.53:5000/catalog/api/cartitem/all",
  addCartItem: "http://40.113.124.53:5000/catalog/api/cartitem",
  deleteCartItem: "http://40.113.124.53:5000/catalog/api/cartitem",

  paymentIntent: "http://40.113.124.53:5000/catalog/api/paymentcontroll",

  messages: "http://40.113.124.53:5000/catalog/api/messages",
};
