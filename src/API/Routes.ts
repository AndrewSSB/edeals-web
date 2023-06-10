type apiUrls = {
  login: string;
  register: string;
  logout: string;
  userInfo: string;
  products: string;
};

export const ApiUrls: apiUrls = {
  login: "http://40.113.124.53:5000/core/api/authentication/login",
  register: "http://40.113.124.53:5000/core/api/authentication/register",
  logout: "http://40.113.124.53:5000/core/api/authentication/logout",
  userInfo: "http://40.113.124.53:5000/core/api/user/info",
  products: "http://40.113.124.53:5000/catalog/api/product/all",
};
