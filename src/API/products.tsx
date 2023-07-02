import axios from "axios";
import { ApiUrls } from "./Routes";
import { Address } from "../context/UserContext";

interface ProductsProps {
  start: number | null;
  limit: number | null;
  productName: string | null;
  categoryId: number | null;
  orderByPrice: boolean | null;
}

interface FavoriteProps {
  productId: string;
}

interface CartItemProps {
  quantity: number;
  productId: string;
}

export const getProducts = async (props: ProductsProps) => {
  let apiUrl = `${ApiUrls.getProducts}?`;

  if (props.productName && props.productName !== "") {
    apiUrl += `productName=${props.productName}&`;
  }

  if (props.categoryId) {
    apiUrl += `categoryId=${props.categoryId}&`;
  }

  if (props.orderByPrice === true || props.orderByPrice === false) {
    apiUrl += `orderByPrice=${props.orderByPrice}&`;
  }

  const response = await axios.get(`${apiUrl}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

export const getProduct = async (props: FavoriteProps) => {
  const response = await axios.get(`${ApiUrls.getProduct}/${props.productId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

interface AddReviewProps {
  rating: number;
  title: string;
  comment: string;
  productId: string;
}

export const addReview = async (props: AddReviewProps) => {
  const response = await axios.post(
    `${ApiUrls.addReview}`,
    {
      productId: props.productId,
      rating: props.rating,
      comment: props.comment,
      title: props.title,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

export const addQuestion = async (props: AddReviewProps) => {
  const response = await axios.post(
    `${ApiUrls.addQuestion}`,
    {
      productId: props.productId,
      comment: props.comment,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

interface ApplyShoppingDiscountProps {
  id?: number;
  discountCode: string;
}

export const applyShoppingDiscount = async (
  props: ApplyShoppingDiscountProps
) => {
  const response = await axios.post(
    `${ApiUrls.applyShoppingDiscount}`,
    {
      id: props.id,
      discountCode: props.discountCode,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

export const getDiscount = async (value: string) => {
  const response = await axios.get(`${ApiUrls.getDiscount}/${value}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

// order

export interface LocalShopping {
  productId: string;
  quantity: number;
}

export const createDraftOrder = async (
  transportPrice: number,
  paymentType: number,
  userAddress: Address,
  shoppingSessionId?: number,
  total?: number,
  localShopping?: LocalShopping[]
) => {
  const response = await axios.post(
    `${ApiUrls.createDraftOrder}`,
    {
      transportPrice: transportPrice,
      paymentType: paymentType,
      userAddress,
      shoppingSessionId: shoppingSessionId,
      total: total,
      localShopping: localShopping,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

export const createOrder = async (orderId: number) => {
  const response = await axios.post(
    `${ApiUrls.createOrder}/${orderId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

export const getOrders = async () => {
  const response = await axios.get(`${ApiUrls.getOrders}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

// Favorites

export const addFavorites = async (props: FavoriteProps) => {
  const response = await axios.post(
    `${ApiUrls.addFavorite}`,
    {
      productId: props.productId,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

export const getFavorites = async () => {
  const response = await axios.get(`${ApiUrls.getFavorite}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

export const deleteFavorites = async (id: number | string) => {
  const response = await axios.delete(`${ApiUrls.deleteFavorite}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

// Shopping session

export const getShoppingSession = async (value: number | null) => {
  let apiUrl = `${ApiUrls.getShoppingSession}`;

  if (value) {
    apiUrl += `/${value}`;
  }

  const response = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

export const getCartItems = async () => {
  const response = await axios.get(`${ApiUrls.getCartItems}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

export const addCartItems = async (props: CartItemProps) => {
  const response = await axios.post(
    `${ApiUrls.addCartItem}`,
    { quantity: props.quantity, productId: props.productId },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response;
};

export const deleteCartItem = async (id: number | string) => {
  const response = await axios.delete(`${ApiUrls.deleteCartItem}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};

export const getCategories = async () => {
  const response = await axios.get(`${ApiUrls.categories}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response;
};
