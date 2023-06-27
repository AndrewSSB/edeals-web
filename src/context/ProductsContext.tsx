import React, { createContext, useEffect, useState } from "react";
import {
  getCategories,
  getFavorites,
  getProducts,
  getShoppingSession,
} from "../API/products";
import { GetProductsFromLocalStorage } from "../hooks/SetItemsToLocalStorage";

type ProductContextProps = {
  children: React.ReactNode;
};

interface Review {
  firstName: string;
  lastName: string;
  comment: string;
  createdAt: string;
  email: string;
  username: string;
  rating: number;
  title: string;
  hasBoughtProduct: boolean;
}

interface Comment {
  firstName: string;
  lastName: string;
  comment: string;
  createdAt: string;
  username: string;
}

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
  reviews: Review[];
  comments: Comment[];
}

export interface CartItem {
  cartItemId: number;
  productId: string;
  productName: string;
  productPrice: string;
  quantity: number;
  shoppingSessionId: number;
  description: string;
  image: string;
}

export interface ShoppingSession {
  shoppingSessionId: number;
  total: number;
  cartItems: CartItem[];
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description: string;
  parentCategoryId: number | null;
  parentCategory: Category | null;
  subCategories: Category[] | null;
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
  categories: Category[];
  setCategories: (value: Category[]) => void;
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
  const [categories, setCategories] = useState<Category[]>([]);

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

        if (!localStorage.getItem("accessToken")) {
          const favoritesFromLocalStorage = GetProductsFromLocalStorage({
            keyName: "favorite",
          });

          const filteredProducts = responseData.data.filter(
            (product: { productId: string }) => {
              if (favoritesFromLocalStorage) {
                return favoritesFromLocalStorage.find(
                  (prd) => prd.productId === product.productId
                );
              }
              return false;
            }
          );

          setFavorites(filteredProducts);
        }

        if (!localStorage.getItem("accessToken")) {
          const cartItemsFromLocalStorage = GetProductsFromLocalStorage({
            keyName: "cartItems",
          });

          const productsFromLocal: Product[] = responseData.data.filter(
            (product: { productId: string }) => {
              if (cartItemsFromLocalStorage) {
                return cartItemsFromLocalStorage.find(
                  (prd) => prd.productId === product.productId
                );
              }
              return false;
            }
          );

          shoppingSession.cartItems = productsFromLocal.map((prod, idx) => {
            return {
              cartItemId: idx,
              productId: prod.productId,
              productName: prod.name,
              quantity: 0,
              shoppingSessionId: 0,
              image: prod.images.mainImage,
              productPrice: prod.price.toString(),
              description: prod.shortDescription,
            };
          });

          shoppingSession.total = +shoppingSession.cartItems
            .reduce((accumulator, item) => {
              return accumulator + +item.productPrice * item.quantity;
            }, 0)
            .toFixed(2);

          setShoppingSession(shoppingSession);
        }
      } catch (error: any) {
        console.log("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();

        const categories = response.data.responseData;

        setCategories(categories);
      } catch {
        console.error("n-a mers categories");
      }
    };

    fetchCategories();
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
        categories,
        setCategories,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
