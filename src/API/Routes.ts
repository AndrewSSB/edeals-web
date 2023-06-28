const localUrl = "https://localhost:7056";
const prodUrl = "http://40.113.124.53:5000";

type apiUrls = {
  login: string;
  register: string;
  logout: string;
  userInfo: string;
  getProducts: string;
  getProduct: string;
  addFavorite: string;
  deleteFavorite: string;
  getFavorite: string;
  getCartItems: string;
  addCartItem: string;
  deleteCartItem: string;
  getShoppingSession: string;

  paymentIntent: string;
  messages: string;
  categories: string;
  addReview: string;
  addQuestion: string;
  applyShoppingDiscount: string;
  getDiscount: string;
  saveAddress: string;
  getAddress: string;
};

export const ApiUrls: apiUrls = {
  login: `${localUrl}/core/api/authentication/login`,
  register: `${localUrl}/core/api/authentication/register`,
  logout: `${localUrl}/core/api/authentication/logout`,
  userInfo: `${localUrl}/core/api/user/info`,

  getProducts: `${localUrl}/catalog/api/product/all`,
  getProduct: `${localUrl}/catalog/api/product`,

  addFavorite: `${localUrl}/catalog/api/favorites`,
  deleteFavorite: `${localUrl}/catalog/api/favorites`,
  getFavorite: `${localUrl}/catalog/api/favorites`,

  getShoppingSession: `${localUrl}/catalog/api/shoppingsession`,
  getCartItems: `${localUrl}/catalog/api/cartitem/all`,
  addCartItem: `${localUrl}/catalog/api/cartitem`,
  deleteCartItem: `${localUrl}/catalog/api/cartitem`,

  paymentIntent: `${localUrl}/catalog/api/paymentcontroll`,

  messages: `${localUrl}/catalog/api/messages`,

  categories: `${localUrl}/catalog/api/category/all`,

  addReview: `${localUrl}/catalog/api/review/review`,
  addQuestion: `${localUrl}/catalog/api/review/question`,

  applyShoppingDiscount: `${localUrl}/catalog/api/shoppingsession/apply-discount`,
  getDiscount: `${localUrl}/catalog/api/discount`,

  saveAddress: `${localUrl}/catalog/api/userinfo/save-address`,
  getAddress: `${localUrl}/catalog/api/userinfo`,
};
