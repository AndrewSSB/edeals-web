import React, { createContext, useEffect, useState } from "react";
import { getProducts } from "../API/products";

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

type ProductContextType = {
  products: Product[];
  setProducts: (value: Product[]) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  totalPageNumber: number;
  setTotalPageNumber: (value: number) => void;
  currentPageNumber: number;
  setCurrentPageNumber: (value: number) => void;
};

export const ProductContext = createContext<ProductContextType>(
  {} as ProductContextType
);

export const ProductContextProvider = ({ children }: ProductContextProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageSize, setPageSize] = useState<number>(1);
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();

        const responseData = response.data.responseData;
        setProducts(responseData.data);
        setPageSize(responseData.pageSize);
        setTotalPageNumber(responseData.totalPageNumber);
        setCurrentPageNumber(responseData.currentPageNumber);
      } catch (error: any) {
        console.log("Failed to fetch user details:", error);
      }
    };

    fetchProducts();
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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
