// export const localUrl = "https://localhost:7056";
// export const prodUrl = "http://40.113.124.53:5000";

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
  getConversations: string;
  categories: string;
  addReview: string;
  addQuestion: string;
  applyShoppingDiscount: string;
  getDiscount: string;
  saveAddress: string;
  getAddress: string;
  getReviews: string;
  createDraftOrder: string;
  createOrder: string;
  getOrders: string;
  getUsers: string;
  sendEmailCode: string;
  sendPhoneCode: string;
  validateEmail: string;
  validatePhone: string;
  updateUser: string;
  deleteAccount: string;

  deleteProduct: string;
  blockUser: string;
  unblockUser: string;
  getUsersAdmin: string;
};

export const ApiUrls: apiUrls = {
  login: `${process.env.REACT_APP_BASE_API_URL}/core/api/authentication/login`,
  register: `${process.env.REACT_APP_BASE_API_URL}/core/api/authentication/register`,
  logout: `${process.env.REACT_APP_BASE_API_URL}/core/api/authentication/logout`,
  sendEmailCode: `${process.env.REACT_APP_BASE_API_URL}/core/api/authentication/validate-email`,
  validateEmail: `${process.env.REACT_APP_BASE_API_URL}/core/api/authentication/confirm-email`,
  sendPhoneCode: `${process.env.REACT_APP_BASE_API_URL}/core/api/authentication/validate-phone`,
  validatePhone: `${process.env.REACT_APP_BASE_API_URL}/core/api/authentication/confirm-phone`,
  userInfo: `${process.env.REACT_APP_BASE_API_URL}/core/api/user/info`,
  getUsers: `${process.env.REACT_APP_BASE_API_URL}/core/api/user/all`,
  getUsersAdmin: `${process.env.REACT_APP_BASE_API_URL}/core/api/user/admin-all`,
  updateUser: `${process.env.REACT_APP_BASE_API_URL}/core/api/user`,
  deleteAccount: `${process.env.REACT_APP_BASE_API_URL}/core/api/user/account`,
  blockUser: `${process.env.REACT_APP_BASE_API_URL}/core/api/user/block`,
  unblockUser: `${process.env.REACT_APP_BASE_API_URL}/core/api/user/unblock`,

  getProducts: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/product/all`,
  getProduct: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/product`,
  deleteProduct: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/product`,

  addFavorite: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/favorites`,
  deleteFavorite: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/favorites`,
  getFavorite: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/favorites`,

  getShoppingSession: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/shoppingsession`,
  getCartItems: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/cartitem/all`,
  addCartItem: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/cartitem`,
  deleteCartItem: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/cartitem`,

  paymentIntent: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/paymentcontroll`,

  messages: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/messages`,
  getConversations: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/messages/conversations`,

  categories: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/category/all`,

  addReview: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/review/review`,
  addQuestion: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/review/question`,

  applyShoppingDiscount: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/shoppingsession/apply-discount`,
  getDiscount: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/discount`,

  saveAddress: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/userinfo/save-address`,
  getAddress: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/userinfo`,

  getReviews: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/review/reviews`,
  createDraftOrder: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/order/draft`,
  createOrder: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/order`,
  getOrders: `${process.env.REACT_APP_BASE_API_URL}/catalog/api/order`,
};
