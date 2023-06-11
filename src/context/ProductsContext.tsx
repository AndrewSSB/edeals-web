import React, { createContext, useEffect, useState } from "react";
import {
  getCartItems,
  getFavorites,
  getProducts,
  getShoppingSession,
} from "../API/products";

type ProductContextProps = {
  children: React.ReactNode;
};

export interface Product {
  productId: string;
  name: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  color: string;
  images: {
    mainImage: string;
    scrollImages: string[];
  };
  categories: {
    categoryId: number;
    categoryName: "";
    description: "";
    parentCategoryId: number;
    parentCategory: null;
  };
  inventory: {
    quantity: number;
  };
  brand: {
    name: string;
  };
  seller: {
    name: string;
  };
  discounts: {
    discountCode: string;
    discountName: string;
    description: string;
    discountPercent: number;
  }[];
}

export interface CartItem {
  cartItemId: number;
  productId: string;
  productName: string;
  productPrice: string;
  quantity: number;
  shoppingSessionId: number;
}

export interface ShoppingSession {
  shoppingSessionId: number;
  total: number;
  cartItems: CartItem[];
}

type ProductContextType = {
  products: Product[];
  setProducts: (value: Product[]) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  totalPageNumber: number;
  setTotalPageNumber: (value: number) => void;
  currentPageNumber: number;
  setCurrentPageNumber: (value: number) => void;
  favorites: Product[];
  setFavorites: (value: Product[]) => void;
  shoppingSession: ShoppingSession;
  setShoppingSession: (value: ShoppingSession) => void;
};

export const ProductContext = createContext<ProductContextType>(
  {} as ProductContextType
);

export const ProductContextProvider = ({ children }: ProductContextProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageSize, setPageSize] = useState<number>(1);
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [shoppingSession, setShoppingSession] = useState<ShoppingSession>({
    shoppingSessionId: 0,
    cartItems: [],
    total: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({
          start: null,
          limit: null,
          productName: null,
        });

        const responseData = response.data.responseData;
        setProducts(responseData.data);
        setPageSize(responseData.pageSize);
        setTotalPageNumber(responseData.totalPageNumber);
        setCurrentPageNumber(responseData.currentPageNumber);
      } catch (error: any) {
        console.log("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getFavorites();

        const responseData = response.data.responseData;

        setFavorites(responseData);
      } catch (error: any) {
        console.error("Failed to fetch favorite products:", error);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await getShoppingSession(1);

        const responseData = response.data.responseData;
        setShoppingSession(responseData);
      } catch (error: any) {
        console.error("Failed to fetch shopping session:", error);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        totalPageNumber,
        setTotalPageNumber,
        pageSize,
        setPageSize,
        currentPageNumber,
        setCurrentPageNumber,
        favorites,
        setFavorites,
        shoppingSession,
        setShoppingSession,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
